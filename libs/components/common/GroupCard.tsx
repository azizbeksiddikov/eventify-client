import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useApolloClient, useReactiveVar } from "@apollo/client";
import { Heart, Calendar, Users, ExternalLink, Eye } from "lucide-react";
import { useMutation } from "@apollo/client";
import { userVar } from "@/apollo/store";

import { Button } from "@/libs/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/libs/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/libs/components/ui/tooltip";
import { Badge } from "@/libs/components/ui/badge";

import { NEXT_APP_API_URL } from "@/libs/config";

import { JOIN_GROUP, LEAVE_GROUP, LIKE_TARGET_GROUP } from "@/apollo/user/mutation";
import { Group } from "@/libs/types/group/group";
import { joinGroup, leaveGroup, likeGroup } from "@/libs/utils";

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
		<Card className="pt-0 w-full mx-auto shadow-md hover:shadow-lg transition-all duration-300 bg-card/60 flex flex-col h-full group hover:scale-105 gap-0">
			<CardHeader className="p-0 gap-0">
				<div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl">
					<Link href={`/group/detail?groupId=${group._id}`}>
						<Image
							src={`${NEXT_APP_API_URL}/${group.groupImage}`}
							alt={group.groupName}
							fill
							className="object-cover transition-transform duration-300"
						/>
					</Link>
					<div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						<Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm text-xs px-2 py-0.5">
							<Eye className="w-3.5 h-3.5 mr-1" />
							{group.groupViews || 0}
						</Badge>
					</div>
					<div className="absolute bottom-2.5 left-2.5">
						<Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm text-xs px-2 py-0.5">
							<Users className="w-3.5 h-3.5 mr-1" />
							{group.memberCount || 0}
						</Badge>
					</div>
					<div className="absolute bottom-2.5 right-2.5">
						<Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm text-xs px-2 py-0.5">
							<Calendar className="w-3.5 h-3.5 mr-1" />
							{group.eventsCount || 0}
						</Badge>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-2.5 p-2 flex-1 flex flex-col">
				<div className="space-y-1.5">
					<h3 className="text-base font-semibold text-foreground line-clamp-1 h-5">{group.groupName}</h3>

					<div className="flex flex-wrap gap-1 min-h-[18px]">
						{group.groupCategories.map((category, index) => (
							<span key={index} className="text-[11px] text-primary/90 bg-primary/10 px-2 py-0.5 rounded-full">
								#{category}
							</span>
						))}
					</div>

					<div className="space-y-1">
						<div className="flex items-center gap-1.5 text-xs text-muted-foreground h-4.5">
							<Calendar className="w-3.5 h-3.5 flex-shrink-0" />
							<span>{new Date(group.createdAt).toLocaleDateString()}</span>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-1.5 p-1.5 bg-muted/50 rounded-lg mt-1">
					{[
						{
							icon: <Users className="h-3 w-3 text-primary" />,
							value: group.memberCount || 0,
							label: t("Total group members"),
						},
						{
							icon: <Calendar className="h-3 w-3 text-primary" />,
							value: group.eventsCount || 0,
							label: t("Total events organized"),
						},
						{
							icon: <Heart className="h-3 w-3 text-primary" />,
							value: group.groupLikes || 0,
							label: t("Total likes received"),
						},
					].map((item, i) => (
						<Tooltip key={i}>
							<TooltipTrigger asChild>
								<div className="flex items-center justify-center gap-1.5 p-1 rounded-md bg-card/70 hover:bg-card transition-colors cursor-help">
									{item.icon}
									<p className="text-[11px] font-medium">{item.value}</p>
								</div>
							</TooltipTrigger>
							<TooltipContent side="bottom">{item.label}</TooltipContent>
						</Tooltip>
					))}
				</div>

				<div className="px-0.5 mt-1">
					<div className="bg-muted/30 p-1.5 rounded-lg min-h-[44px] flex items-center">
						{group.groupDesc ? (
							<p className="text-xs text-foreground leading-snug line-clamp-2">{group.groupDesc}</p>
						) : (
							<p className="text-xs text-muted-foreground italic flex items-center justify-center py-1 w-full">
								<span className="bg-muted/50 px-2 py-0.5 rounded-md">{t("No description available")}</span>
							</p>
						)}
					</div>
				</div>
			</CardContent>

			<CardFooter className="border-t   flex items-center justify-between gap-2 py-0 my-0">
				<Button
					variant="ghost"
					size="sm"
					className={`h-7 px-2.5 text-xs font-medium transition-all ${
						group?.meLiked?.[0]?.myFavorite ? "text-rose-500" : ""
					}`}
					onClick={() => likeGroupHandler(group._id)}
				>
					<Heart
						className={`h-3 w-3 mr-1 transition-all ${
							group?.meLiked?.[0]?.myFavorite ? "fill-current stroke-current" : ""
						}`}
					/>
					{group?.meLiked?.[0]?.myFavorite ? t("Liked") : t("Like")}
				</Button>

				<Button
					variant={group?.meJoined?.[0]?.meJoined ? "outline" : "default"}
					size="sm"
					className={`h-7 px-2.5 text-xs font-medium transition-all ${
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
						className="h-7 px-2.5 rounded-lg text-xs hover:bg-primary/5 border-primary/30 text-primary transition-colors"
					>
						<ExternalLink className="h-3 w-3 mr-1" />
						{t("View")}
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};

export default GroupCard;
