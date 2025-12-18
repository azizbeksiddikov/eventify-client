import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useApolloClient, useReactiveVar } from "@apollo/client/react";
import { Heart, Calendar, Users, ExternalLink } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { userVar } from "@/apollo/store";

import { Button } from "@/libs/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/libs/components/ui/card";
import { Badge } from "@/libs/components/ui/badge";

import { JOIN_GROUP, LEAVE_GROUP, LIKE_TARGET_GROUP } from "@/apollo/user/mutation";
import { Group } from "@/libs/types/group/group";
import { joinGroup, leaveGroup, likeGroup, getImageUrl, formatSeoulDate } from "@/libs/utils";

interface GroupCardProps {
	group: Group;
}

const GroupCard = ({ group }: GroupCardProps) => {
	const { t } = useTranslation("common");
	const user = useReactiveVar(userVar);

	/** APOLLO */
	const [likeTargetGroup] = useMutation(LIKE_TARGET_GROUP);
	const [joinTargetGroup] = useMutation(JOIN_GROUP);
	const [leaveTargetGroup] = useMutation(LEAVE_GROUP);

	const client = useApolloClient();

	/** HANDLERS **/
	const likeGroupHandler = async (groupId: string) => {
		likeGroup(user._id, groupId, likeTargetGroup, client.cache);
	};

	const joinGroupHandler = async (groupId: string) => {
		joinGroup(user._id, groupId, joinTargetGroup, t);
	};

	const leaveGroupHandler = async (groupId: string) => {
		leaveGroup(user._id, groupId, leaveTargetGroup, t);
	};

	return (
		<Card className="min-w-[340px] py-0 ui-card group gap-0">
			<CardHeader className="p-0 gap-0">
				<div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
					<Link href={`/groups?${group._id}`}>
						<Image
							src={getImageUrl(group.groupImage, "group")}
							alt={group.groupName}
							fill
							className="object-cover transition-transform duration-300"
							unoptimized={process.env.NODE_ENV === "development"}
						/>
					</Link>
					<div className="absolute bottom-1.5 left-1.5 flex items-center gap-1.5">
						<Badge variant="secondary" className="bg-background/80 shadow-sm text-[10px] px-1.5 py-0.5">
							<Users className="w-2.5 h-2.5 mr-0.5" />
							{group.memberCount || 0}
						</Badge>
						<Badge variant="secondary" className="bg-background/80 shadow-sm text-[10px] px-1.5 py-0.5">
							<Calendar className="w-2.5 h-2.5 mr-0.5" />
							{group.eventsCount || 0}
						</Badge>
					</div>
				</div>
			</CardHeader>

			<CardContent className="pt-3 px-3 pb-0 flex-1 flex flex-col">
				<div className="space-y-2 text-[12px] leading-5">
					<Link href={`/groups?${group._id}`} className="block">
						<h3 className="text-[13px] leading-5 font-semibold text-foreground line-clamp-1">{group.groupName}</h3>
					</Link>

					<div className="flex flex-wrap gap-1.5 min-h-[20px]">
						{group.groupCategories?.slice(0, 4).map((category, index) => (
							<span key={index} className="text-primary/90 bg-primary/10 px-2 py-0.5 rounded-full">
								#{category}
							</span>
						))}
					</div>

					<div className="space-y-1">
						<div className="flex items-center gap-2 text-muted-foreground">
							<Calendar className="w-2.5 h-2.5 shrink-0" />
							<span>{formatSeoulDate(group.createdAt)}</span>
						</div>
					</div>
				</div>

				<div className="px-0.5 mt-2">
					<div className="bg-muted/30 p-2 rounded-md min-h-[44px] flex items-center">
						{group.groupDesc ? (
							<p className="text-foreground leading-snug line-clamp-2">{group.groupDesc}</p>
						) : (
							<p className="text-muted-foreground italic flex items-center justify-center py-1 w-full">
								<span className="bg-muted/50 px-2 py-0.5 rounded-md">{t("No description available")}</span>
							</p>
						)}
					</div>
				</div>
			</CardContent>

			<CardFooter className="border-t flex items-center justify-around gap-2 px-10 py-3">
				<div className="ui-like-pill">
					<Button
						variant="ghost"
						size="sm"
						className={`h-9 w-9 p-0 transition-colors ${
							group?.meLiked?.[0]?.myFavorite
								? "text-rose-500 hover:text-rose-500"
								: "text-muted-foreground hover:text-foreground"
						}`}
						onClick={() => likeGroupHandler(group._id)}
						aria-label={group?.meLiked?.[0]?.myFavorite ? t("Liked") : t("Like")}
					>
						<Heart
							className={`w-4 h-4 transition-all ${
								group?.meLiked?.[0]?.myFavorite ? "fill-current stroke-current" : ""
							}`}
						/>
					</Button>
					<span className="text-sm font-medium text-muted-foreground tabular-nums">{group.groupLikes || 0}</span>
				</div>

				<Button
					variant={group?.meJoined?.[0]?.meJoined ? "outline" : "default"}
					size="sm"
					className={`h-9 px-3 text-sm font-medium transition-colors ${
						group?.meJoined?.[0]?.meJoined ? "border-primary/30 text-primary hover:bg-primary/5" : ""
					}`}
					onClick={() => (group?.meJoined?.[0]?.meJoined ? leaveGroupHandler(group._id) : joinGroupHandler(group._id))}
				>
					{group?.meJoined?.[0]?.meJoined ? t("Leave") : t("Join")}
				</Button>

				<Link href={`/group/detail?groupId=${group._id}`}>
					<Button
						variant="outline"
						size="sm"
						className="h-9 w-9 p-0 rounded-lg hover:bg-primary/5 border-primary/30 text-primary"
						aria-label={t("View")}
					>
						<ExternalLink className="w-4 h-4" />
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};

export default GroupCard;
