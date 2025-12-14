import { useTranslation } from "next-i18next";
import Link from "next/link";
import { Heart, Calendar, Users, ExternalLink, Mail, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/libs/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/libs/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/libs/components/ui/tooltip";
import { Button } from "@/libs/components/ui/button";

import { Member } from "@/libs/types/member/member";
import { getImageUrl } from "@/libs/utils";

interface OrganizerCardProps {
	organizer: Member;
	likeMemberHandler: (memberId: string) => void;
	subscribeHandler: (memberId: string) => void;
	unsubscribeHandler: (memberId: string) => void;
}

const OrganizerCard = ({ organizer, likeMemberHandler, subscribeHandler, unsubscribeHandler }: OrganizerCardProps) => {
	const { t } = useTranslation("common");

	return (
		<Card className="w-full mx-auto shadow-sm hover:shadow-md transition-all duration-300 bg-card/60 flex flex-col h-full group overflow-hidden">
			{/* Header */}
			<CardHeader className="py-2 shrink-0">
				<div className="flex flex-row gap-2 items-center">
					{/* Image */}
					<Avatar className="h-12 w-12 border-2 border-card shadow-md ring-1 ring-primary/20">
						<AvatarImage
							src={getImageUrl(organizer?.memberImage || "", "member")}
							alt={organizer.memberFullName}
							className="rounded-full"
						/>
						<AvatarFallback className="bg-primary/10 text-primary rounded-full">
							<User className="h-6 w-6" />
						</AvatarFallback>
					</Avatar>

					{/* Name and Email */}
					<div className="space-y-1 text-left flex-1 min-w-0">
						<h3 className="flex items-center font-semibold text-sm tracking-tight gap-1">
							<User className="h-3 w-3 text-primary/70 shrink-0" />
							<span className="truncate">{organizer.memberFullName}</span>
						</h3>
						<div className="flex items-center text-[10px] text-muted-foreground gap-1">
							<Mail className="h-3 w-3 text-primary/70 shrink-0" />
							<span className="truncate">{organizer.memberEmail}</span>
						</div>
					</div>
				</div>
			</CardHeader>

			{/* Content */}
			<CardContent className="space-y-2 pb-2 flex-1 min-h-0">
				<div className="grid grid-cols-3 gap-1 p-1.5 bg-muted/50 rounded-lg">
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center gap-0.5 p-1 rounded-md bg-card/70 hover:bg-card transition-colors cursor-help">
								<Calendar className="h-2.5 w-2.5 text-primary" />
								<p className="text-[10px] font-medium">{organizer?.eventsOrganizedCount || 0}</p>
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">{t("Events organized")}</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center gap-0.5 p-1 rounded-md bg-card/70 hover:bg-card transition-colors cursor-help">
								<Users className="h-2.5 w-2.5 text-primary" />
								<p className="text-[10px] font-medium">{organizer.memberFollowers || 0}</p>
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">{t("People following this organizer")}</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center gap-0.5 p-1 rounded-md bg-card/70 hover:bg-card transition-colors cursor-help">
								<Heart className="h-2.5 w-2.5 text-primary" />
								<p className="text-[10px] font-medium">{organizer.memberLikes || 0}</p>
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">{t("Total likes received")}</TooltipContent>
					</Tooltip>
				</div>
				<div className="px-0.5">
					<div className="relative">
						<div className="bg-muted/30 p-1.5 rounded-md min-h-[32px]">
							{organizer.memberDesc ? (
								<p className="text-[10px] text-foreground leading-relaxed line-clamp-2">{organizer.memberDesc}</p>
							) : (
								<p className="text-[10px] text-muted-foreground italic flex items-center justify-center py-1">
									<span className="bg-muted/50 px-2 py-0.5 rounded-md">{t("No description available")}</span>
								</p>
							)}
						</div>
					</div>
				</div>
			</CardContent>

			{/* Footer */}
			<CardFooter className="border-t flex items-center justify-between gap-1.5 p-1.5">
				<Button
					variant="ghost"
					size="sm"
					className={`h-6 w-6 p-0 transition-all ${organizer?.meLiked?.[0]?.myFavorite ? "text-rose-500" : ""}`}
					onClick={() => likeMemberHandler(organizer._id)}
					aria-label={organizer?.meLiked?.[0]?.myFavorite ? t("Liked") : t("Like")}
				>
					<Heart
						className={`h-3 w-3 transition-all ${
							organizer?.meLiked?.[0]?.myFavorite ? "fill-current stroke-current" : ""
						}`}
					/>
				</Button>
				<Button
					variant={organizer?.meFollowed?.[0]?.myFollowing ? "outline" : "default"}
					size="sm"
					className={`h-6 px-2 text-[10px] font-medium transition-all ${
						organizer?.meFollowed?.[0]?.myFollowing ? "border-primary/30 text-primary hover:bg-primary/5" : ""
					}`}
					onClick={() =>
						organizer?.meFollowed?.[0]?.myFollowing
							? unsubscribeHandler(organizer._id)
							: subscribeHandler(organizer._id)
					}
				>
					{organizer?.meFollowed?.[0]?.myFollowing ? t("Following") : t("Follow")}
				</Button>
				<Link href={`/organizers/${organizer._id}`}>
					<Button
						variant="outline"
						size="sm"
						className="h-6 w-6 p-0 rounded-md hover:bg-primary/5 border-primary/30 text-primary transition-colors"
						aria-label={t("View")}
					>
						<ExternalLink className="h-3 w-3" />
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};

export default OrganizerCard;
