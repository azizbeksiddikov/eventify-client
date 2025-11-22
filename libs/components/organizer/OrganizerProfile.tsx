import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { useReactiveVar } from "@apollo/client";
import { Users, Heart, Eye, Mail, Phone, Calendar, Shield, Star, User as UserIcon } from "lucide-react";

import { Badge } from "@/libs/components/ui/badge";
import { Button } from "@/libs/components/ui/button";
import { Separator } from "@/libs/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/libs/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/libs/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/libs/components/ui/tooltip";

import { NEXT_APP_API_URL } from "@/libs/config";
import type { Member } from "@/libs/types/member/member";
import type { MemberType } from "@/libs/enums/member.enum";
import { userVar } from "@/apollo/store";
import { cn } from "@/libs/utils";

interface OrganizerProfileProps {
	organizer: Member | null | undefined;
	likeMemberHandler: (memberId: string) => void;
	subscribeHandler: (memberId: string) => void;
	unsubscribeHandler: (memberId: string) => void;
}

const getMemberTypeBadge = (type: MemberType, t: (key: string) => string) => {
	const iconBaseClass = "h-3 w-3 mr-1.5";
	switch (type) {
		case "ADMIN":
			return (
				<Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
					<Shield className={iconBaseClass} />
					{t("Admin")}
				</Badge>
			);
		case "ORGANIZER":
			return (
				<Badge variant="secondary" className="bg-accent/10 text-accent-foreground hover:bg-accent/20 transition-colors">
					<Star className={iconBaseClass} />
					{t("Organizer")}
				</Badge>
			);
		case "USER":
			return (
				<Badge
					variant="outline"
					className="border-secondary/20 text-secondary-foreground hover:bg-secondary/5 transition-colors"
				>
					<UserIcon className={iconBaseClass} />
					{t("User")}
				</Badge>
			);
		default:
			return null;
	}
};

const OrganizerProfile = ({
	organizer,
	likeMemberHandler,
	subscribeHandler,
	unsubscribeHandler,
}: OrganizerProfileProps) => {
	const { t } = useTranslation("common");
	const currentUser = useReactiveVar(userVar);

	const [isFollowing, setIsFollowing] = useState(!!organizer?.meFollowed?.[0]?.myFollowing);
	const [isLiked, setIsLiked] = useState(!!organizer?.meLiked?.[0]?.myFavorite);

	useEffect(() => {
		if (organizer) {
			setIsFollowing(!!organizer.meFollowed?.[0]?.myFollowing);
			setIsLiked(!!organizer.meLiked?.[0]?.myFavorite);
		}
	}, [organizer]);

	const followHandler = useCallback(() => {
		if (!organizer) return;
		if (isFollowing) {
			unsubscribeHandler(organizer._id);
			setIsFollowing(false);
		} else {
			subscribeHandler(organizer._id);
			setIsFollowing(true);
		}
	}, [isFollowing, organizer, subscribeHandler, unsubscribeHandler]);

	const likeHandler = useCallback(() => {
		if (!organizer) return;
		likeMemberHandler(organizer._id);
		setIsLiked((prev) => !prev);
	}, [organizer, likeMemberHandler]);

	if (!organizer) {
		return null;
	}

	const statsData = [
		{ icon: <Eye className="h-4 w-4 text-muted-foreground" />, label: t("Views"), value: organizer.memberViews },
		{
			icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
			label: t("Events Organized"),
			value: organizer.eventsOrganizedCount,
		},
		{
			icon: <Users className="h-4 w-4 text-muted-foreground" />,
			label: t("Followers"),
			value: organizer.memberFollowers,
		},
		{
			icon: <Users className="h-4 w-4 text-muted-foreground" />,
			label: t("Following"),
			value: organizer.memberFollowings,
		},
	];

	return (
		<Card className=" /40 shadow-sm w-full bg-gradient-to-b from-primary/5 to-transparent">
			<CardHeader className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6">
				<div className="flex flex-col items-center gap-4 w-full md:w-auto md:max-w-[200px] lg:max-w-[250px]">
					<Avatar className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full ring-4 ring-background shadow-md">
						{organizer.memberImage ? (
							<AvatarImage
								src={`${NEXT_APP_API_URL}/${organizer.memberImage}`}
								alt={organizer.memberFullName ?? t("Owner avatar")}
								className="rounded-full object-cover"
							/>
						) : (
							<AvatarFallback className="bg-muted rounded-full">
								<UserIcon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-muted-foreground" />
							</AvatarFallback>
						)}
					</Avatar>

					<div className="grid grid-cols-2 gap-2 pt-2 w-full">
						<Button
							disabled={organizer._id === currentUser?._id}
							onClick={followHandler}
							variant="outline"
							size="sm"
							className={cn(
								"flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm rounded-lg sm:rounded-xl w-full truncate transition-all duration-200 ease-in-out",
								{
									"bg-primary text-primary-foreground border-primary hover:bg-primary/90": !isFollowing,
									"text-muted-foreground   bg-muted hover:bg-muted/50": isFollowing,
								},
							)}
						>
							{isFollowing ? t("Following") : t("Follow")}
						</Button>

						<Button
							onClick={likeHandler}
							variant="outline"
							size="sm"
							className={cn(
								"flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm w-full transition-all duration-200 ease-in-out bg-muted/40 hover:bg-muted/50 rounded-lg sm:rounded-xl",
								isLiked
									? "text-destructive hover:text-destructive/90 border-destructive/50 hover:border-destructive/70"
									: "text-muted-foreground hover:text-primary border-input",
							)}
						>
							<Heart
								className={cn(
									"h-4 w-4 sm:h-5 sm:w-5 transition-all duration-200 ease-in-out",
									isLiked ? "fill-destructive text-destructive" : "text-primary/70",
								)}
							/>
							<span className="font-medium">{organizer.memberLikes.toLocaleString()}</span>
						</Button>
					</div>
				</div>

				<div className="flex-1 text-center md:text-left w-full md:w-auto mt-4 md:mt-0">
					<div className="flex flex-col justify-start h-full gap-3 sm:gap-4 md:gap-5">
						<div className="flex flex-col items-center md:items-start gap-1 sm:gap-1.5">
							<h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight">
								{organizer.memberFullName}
							</h1>
							<div className="flex flex-wrap items-center justify-center md:justify-start gap-1 sm:gap-2 mt-1">
								{getMemberTypeBadge(organizer.memberType, t)}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2 md:pt-0">
							{statsData.map((stat) => (
								<TooltipProvider key={stat.label} delayDuration={300}>
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="flex items-center gap-2 sm:gap-3 overflow-hidden p-2 sm:p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors cursor-default">
												<div className="flex-shrink-0">{stat.icon}</div>
												<span className="text-xs sm:text-sm font-semibold text-foreground truncate">
													{stat.value.toLocaleString()}
												</span>
											</div>
										</TooltipTrigger>
										<TooltipContent side="bottom" align="center">
											<p className="text-xs">
												{stat.value.toLocaleString()} {stat.label}
											</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							))}
						</div>
					</div>
				</div>
			</CardHeader>

			<Separator className="my-2 sm:my-4 mx-4 sm:mx-6" />

			<CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
					<div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
						<div className="flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10">
							<Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-xs text-muted-foreground font-medium">{t("Email")}</p>
							<p className="text-xs sm:text-sm font-medium text-foreground truncate">{organizer.memberEmail}</p>
						</div>
					</div>

					{organizer.memberPhone && (
						<div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
							<div className="flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10">
								<Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-xs text-muted-foreground font-medium">{t("Phone")}</p>
								<p className="text-xs sm:text-sm font-medium text-foreground truncate">{organizer.memberPhone}</p>
							</div>
						</div>
					)}
				</div>

				{organizer.memberDesc && (
					<div className="rounded-lg bg-muted/30 p-3 sm:p-4 border  /30">
						<h3 className="text-sm sm:text-base font-semibold mb-1.5 sm:mb-2 text-foreground">{t("About")}</h3>
						<div className="prose prose-xs sm:prose-sm max-w-none text-muted-foreground dark:prose-invert">
							{organizer.memberDesc}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default OrganizerProfile;
