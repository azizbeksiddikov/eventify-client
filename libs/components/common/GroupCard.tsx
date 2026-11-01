import { SafeImage } from "@/libs/components/common/SafeImage";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useReactiveVar } from "@apollo/client/react";
import { Heart, Calendar, Users, ExternalLink } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { userVar } from "@/apollo/store";

import { Button } from "@/libs/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/libs/components/ui/card";
import { Badge } from "@/libs/components/ui/badge";

import { JOIN_GROUP, LEAVE_GROUP, LIKE_TARGET_GROUP } from "@/apollo/user/mutation";
import { Group } from "@/libs/types/group/group";
import { joinGroup, leaveGroup, likeGroup, getImageUrl, formatDate } from "@/libs/utils";
import { ConfirmAction } from "@/libs/components/common/ConfirmAction";

interface GroupCardProps {
	group: Group;
}

const GroupCard = ({ group }: GroupCardProps) => {
	const { t } = useTranslation("groups");
	const user = useReactiveVar(userVar);

	/** APOLLO */
	const [likeTargetGroup] = useMutation(LIKE_TARGET_GROUP);
	const [joinTargetGroup] = useMutation(JOIN_GROUP);
	const [leaveTargetGroup] = useMutation(LEAVE_GROUP);

	/** HANDLERS **/
	const likeGroupHandler = async (groupId: string) => {
		likeGroup(user._id, groupId, likeTargetGroup);
	};

	const joinGroupHandler = async (groupId: string) => {
		joinGroup(user._id, groupId, joinTargetGroup, t);
	};

	const leaveGroupHandler = async (groupId: string) => {
		leaveGroup(user._id, groupId, leaveTargetGroup, t);
	};

	return (
		<Card className="w-full py-0 ui-card group gap-0">
			<CardHeader className="p-0 gap-0">
				<div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
					<Link href={`/groups/${group._id}`}>
						<SafeImage
							src={getImageUrl(group.groupImage, "group")}
							fallbackType="group"
							alt={group.groupName}
							fill
							className="object-cover transition-transform duration-300"
						/>
					</Link>
					<div className="absolute bottom-1.5 left-1.5 flex items-center gap-1.5">
						<Badge variant="secondary" className="bg-background/80 shadow-sm text-xs px-1.5 py-0.5">
							<Users className="w-3 h-3 mr-0.5" />
							{group.memberCount || 0}
						</Badge>
						<Badge variant="secondary" className="bg-background/80 shadow-sm text-xs px-1.5 py-0.5">
							<Calendar className="w-3 h-3 mr-0.5" />
							{group.eventsCount || 0}
						</Badge>
					</div>
				</div>
			</CardHeader>

			<CardContent className="pt-3 px-3 pb-0 flex-1 flex flex-col">
				<div className="space-y-2 text-sm leading-5">
					<Link href={`/groups/${group._id}`} className="flex min-h-11 items-center">
						<h3 className="text-base leading-5 font-semibold text-foreground line-clamp-1">{group.groupName}</h3>
					</Link>

					<div className="flex flex-wrap gap-1.5 min-h-[20px]">
						{group.groupCategories?.slice(0, 4).map((category, index) => (
							<span key={index} className="text-primary bg-primary/10 px-2 py-0.5 rounded-full">
								#{t(category.toLowerCase())}
							</span>
						))}
					</div>

					<div className="space-y-1">
						<div className="flex items-center gap-2 text-muted-foreground">
							<Calendar className="w-3 h-3 shrink-0" />
							<span>{formatDate(group.createdAt)}</span>
						</div>
					</div>
				</div>

				<div className="px-0.5 mt-2">
					<div className="bg-muted/30 p-2 rounded-md min-h-11 flex items-center">
						{group.groupDesc ? (
							<p className="text-sm text-foreground leading-snug line-clamp-2">{group.groupDesc}</p>
						) : (
							<p className="text-muted-foreground italic flex items-center justify-center py-1 w-full">
								<span className="bg-muted/50 px-2 py-0.5 rounded-md">{t("no_description_available")}</span>
							</p>
						)}
					</div>
				</div>
			</CardContent>

			<CardFooter className="border-t flex items-center justify-between gap-1 px-2 sm:px-4 md:px-6 py-3 w-full min-w-0 overflow-hidden">
				<div className="ui-like-pill flex items-center justify-center gap-1 flex-1 min-w-0">
					<Button
						variant="ghost"
						size="sm"
						className={`h-11 w-11 fine:h-9 fine:w-9 p-0 transition-colors shrink-0 ${
							group?.meLiked?.[0]?.myFavorite
								? "text-rose-500 hover:text-rose-500"
								: "text-muted-foreground hover:text-foreground"
						}`}
						onClick={() => likeGroupHandler(group._id)}
						aria-label={group?.meLiked?.[0]?.myFavorite ? t("liked") : t("like")}
					>
						<Heart
							className={`w-4 h-4 transition-all ${
								group?.meLiked?.[0]?.myFavorite ? "fill-current stroke-current" : ""
							}`}
						/>
					</Button>
					<span className="text-xs sm:text-sm font-medium text-muted-foreground tabular-nums whitespace-nowrap">
						{group.groupLikes || 0}
					</span>
				</div>

				<div className="flex items-center justify-center flex-1 min-w-0">
					{group?.meJoined?.[0]?.meJoined ? (
						<ConfirmAction
							title={t("leave_group_title")}
							description={t("leave_group_description")}
							confirmLabel={t("leave_group_confirm")}
							cancelLabel={t("leave_group_stay")}
							onConfirm={() => leaveGroupHandler(group._id)}
						>
						<Button
							variant={group?.meJoined?.[0]?.meJoined ? "outline" : "default"}
							size="sm"
							className={`h-11 fine:h-9 px-4 text-xs sm:text-sm font-medium transition-colors ${
								group?.meJoined?.[0]?.meJoined ? "border-primary/30 text-primary hover:bg-primary/5" : ""
							}`}
							onClick={group?.meJoined?.[0]?.meJoined ? undefined : () => joinGroupHandler(group._id)}
						>
							{group?.meJoined?.[0]?.meJoined ? t("leave") : t("join")}
						</Button>
						</ConfirmAction>
					) : (
						<Button
							variant={group?.meJoined?.[0]?.meJoined ? "outline" : "default"}
							size="sm"
							className={`h-11 fine:h-9 px-4 text-xs sm:text-sm font-medium transition-colors ${
								group?.meJoined?.[0]?.meJoined ? "border-primary/30 text-primary hover:bg-primary/5" : ""
							}`}
							onClick={group?.meJoined?.[0]?.meJoined ? undefined : () => joinGroupHandler(group._id)}
						>
							{group?.meJoined?.[0]?.meJoined ? t("leave") : t("join")}
						</Button>
					)}
				</div>

				<div className="flex items-center justify-center flex-1 min-w-0">
					<Link href={`/groups/${group._id}`}>
						<Button
							variant="outline"
							size="sm"
							className="h-11 w-11 fine:h-9 fine:w-9 p-0 rounded-lg hover:bg-primary/5 border-primary/30 text-primary shrink-0"
							aria-label={t("view")}
						>
							<ExternalLink className="w-4 h-4" />
						</Button>
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
};

export default GroupCard;
