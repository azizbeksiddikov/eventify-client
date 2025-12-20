import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { useReactiveVar } from "@apollo/client/react";
import { Users, Heart, Eye, Mail, Phone, Calendar, User as UserIcon, Crown, CheckCircle2 } from "lucide-react";

import { Badge } from "@/libs/components/ui/badge";
import { Button } from "@/libs/components/ui/button";
import { Card } from "@/libs/components/ui/card";
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
	const iconBaseClass = "h-3.5 w-3.5";
	switch (type) {
		case "ADMIN":
			return (
				<TooltipProvider delayDuration={300}>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px] font-bold uppercase tracking-widest cursor-default group/badge">
								<Crown className={iconBaseClass} fill="currentColor" fillOpacity={0.1} />
								<span className="hidden sm:inline">{t("Admin")}</span>
							</div>
						</TooltipTrigger>
						<TooltipContent side="top">
							<p className="text-[10px] font-bold">{t("Platform Administrator")}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
		case "ORGANIZER":
			return (
				<TooltipProvider delayDuration={300}>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest cursor-default group/badge">
								<CheckCircle2 className={iconBaseClass} fill="currentColor" fillOpacity={0.1} />
								<span className="hidden sm:inline">{t("Organizer")}</span>
							</div>
						</TooltipTrigger>
						<TooltipContent side="top">
							<p className="text-[10px] font-bold">{t("Official Organizer")}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
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

	const isFollowing = !!organizer?.meFollowed?.[0]?.myFollowing;
	const isLiked = !!organizer?.meLiked?.[0]?.myFavorite;

	const followHandler = useCallback(() => {
		if (!organizer) return;
		if (isFollowing) {
			unsubscribeHandler(organizer._id);
		} else {
			subscribeHandler(organizer._id);
		}
	}, [isFollowing, organizer, subscribeHandler, unsubscribeHandler]);

	const likeHandler = useCallback(() => {
		if (!organizer) return;
		likeMemberHandler(organizer._id);
	}, [organizer, likeMemberHandler]);

	if (!organizer) {
		return null;
	}

	const statsData = [
		{ icon: <Eye className="h-4 w-4" />, label: t("Views"), value: organizer.memberViews },
		{
			icon: <Calendar className="h-4 w-4" />,
			label: t("Events"),
			value: organizer.eventsOrganizedCount,
		},
		{
			icon: <Users className="h-4 w-4" />,
			label: t("Followers"),
			value: organizer.memberFollowers,
		},
		{
			icon: <Users className="h-4 w-4" />,
			label: t("Following"),
			value: organizer.memberFollowings,
		},
	];

	return (
		<Card className="overflow-hidden border-none shadow-sm bg-gradient-to-br from-card to-muted/20">
			<div className="p-4 sm:p-5 md:p-6 lg:p-7 flex flex-col md:flex-row gap-5 md:gap-8">
				{/* Left Column: Avatar & Main Actions */}
				<div className="flex flex-col items-center gap-4 shrink-0">
					<div className="relative group">
						<Avatar className="w-20 h-20 md:w-24 md:h-24 rounded-full ring-2 ring-background shadow-lg transition-transform duration-300 group-hover:scale-105">
							{organizer.memberImage ? (
								<AvatarImage
									src={`${NEXT_APP_API_URL}/${organizer.memberImage}`}
									alt={organizer.memberFullName ?? t("Owner avatar")}
									className="object-cover rounded-full"
								/>
							) : (
								<AvatarFallback className="bg-muted rounded-full">
									<UserIcon className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
								</AvatarFallback>
							)}
						</Avatar>
					</div>

					<div className="flex flex-col gap-2 w-full min-w-[140px] md:min-w-[150px]">
						<Button
							disabled={organizer._id === currentUser?._id}
							onClick={followHandler}
							className={cn("w-full h-8 md:h-9 rounded-xl text-xs font-bold transition-all", {
								"bg-primary text-primary-foreground hover:shadow-md": !isFollowing,
								"bg-secondary/80 text-secondary-foreground hover:bg-secondary": isFollowing,
							})}
						>
							{isFollowing ? t("Following") : t("Follow")}
						</Button>
						<Button
							onClick={likeHandler}
							variant="outline"
							className={cn(
								"w-full h-8 md:h-9 rounded-xl text-xs font-bold transition-all border",
								isLiked
									? "text-destructive border-destructive/20 bg-destructive/5"
									: "text-muted-foreground hover:text-primary hover:border-primary/50",
							)}
						>
							<Heart
								className={cn(
									"h-3 w-3 md:h-3.5 md:w-3.5 mr-2 transition-all",
									isLiked ? "fill-destructive text-destructive" : "text-primary/70",
								)}
							/>
							<span className="tabular-nums">{organizer.memberLikes.toLocaleString()}</span>
						</Button>
					</div>
				</div>

				{/* Right Column: Info & Stats */}
				<div className="flex-1 flex flex-col gap-4">
					<div className="space-y-1.5 text-center md:text-left">
						<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
							<h1 className="text-xl md:text-3xl font-black text-foreground tracking-tight">
								{organizer.memberFullName}
							</h1>
							<div className="flex justify-center md:justify-start">{getMemberTypeBadge(organizer.memberType, t)}</div>
						</div>
						<div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-[11px] md:text-xs text-muted-foreground font-semibold">
							<div className="flex items-center gap-1.5 uppercase tracking-wider">
								<Mail className="h-3 w-3 text-primary" />
								<span>{organizer.memberEmail}</span>
							</div>
							{organizer.memberPhone && (
								<div className="flex items-center gap-1.5 uppercase tracking-wider">
									<Phone className="h-3 w-3 text-primary" />
									<span>{organizer.memberPhone}</span>
								</div>
							)}
						</div>
					</div>

					{/* Stats Grid - Very Compact */}
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
						{statsData.map((stat) => (
							<div
								key={stat.label}
								className="flex flex-col items-center md:items-start p-2 md:p-2.5 rounded-xl bg-background/50 border border-transparent hover:border-primary/10 transition-all group/stat"
							>
								<div className="flex items-center gap-2 mb-0.5">
									<div className="text-primary scale-75 md:scale-90 opacity-70 group-hover/stat:opacity-100 transition-opacity">
										{stat.icon}
									</div>
									<span className="text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-widest line-clamp-1">
										{stat.label}
									</span>
								</div>
								<span className="text-sm md:text-lg font-black text-foreground tabular-nums leading-tight">
									{stat.value.toLocaleString()}
								</span>
							</div>
						))}
					</div>

					{organizer.memberDesc && (
						<div className="relative pl-3 border-l-2 border-primary/20">
							<p className="text-[11px] md:text-[13px] text-muted-foreground leading-relaxed italic line-clamp-2 md:line-clamp-3">
								&ldquo;{organizer.memberDesc}&rdquo;
							</p>
						</div>
					)}
				</div>
			</div>
		</Card>
	);
};

export default OrganizerProfile;
