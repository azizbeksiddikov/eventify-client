import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useApolloClient, useReactiveVar } from "@apollo/client/react";
import { Heart, Calendar, Users, ExternalLink, Eye } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { userVar } from "@/apollo/store";

import { Button } from "@/libs/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/libs/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/libs/components/ui/tooltip";
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
		<Card className="pt-0 w-full mx-auto shadow-sm hover:shadow-md transition-all duration-300 bg-card/60 flex flex-col h-full group gap-0">
			<CardHeader className="p-0 gap-0">
				<div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
					<Link href={`/group/detail?groupId=${group._id}`}>
						<Image
							src={getImageUrl(group.groupImage, "group")}
							alt={group.groupName}
							fill
							className="object-cover transition-transform duration-300"
							unoptimized={process.env.NODE_ENV === "development"}
						/>
					</Link>
					<div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						<Badge
							variant="secondary"
							className="bg-background/80 backdrop-blur-sm shadow-sm text-[10px] px-1.5 py-0.5"
						>
							<Eye className="w-2.5 h-2.5 mr-0.5" />
							{group.groupViews || 0}
						</Badge>
					</div>
					<div className="absolute bottom-1.5 left-1.5">
						<Badge
							variant="secondary"
							className="bg-background/80 backdrop-blur-sm shadow-sm text-[10px] px-1.5 py-0.5"
						>
							<Users className="w-2.5 h-2.5 mr-0.5" />
							{group.memberCount || 0}
						</Badge>
					</div>
					<div className="absolute bottom-1.5 right-1.5">
						<Badge
							variant="secondary"
							className="bg-background/80 backdrop-blur-sm shadow-sm text-[10px] px-1.5 py-0.5"
						>
							<Calendar className="w-2.5 h-2.5 mr-0.5" />
							{group.eventsCount || 0}
						</Badge>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-2 flex-1 flex flex-col">
				<div className="space-y-1">
					<h3 className="text-sm font-semibold text-foreground line-clamp-1 h-5">{group.groupName}</h3>

					<div className="flex flex-wrap gap-1 min-h-[16px]">
						{group.groupCategories.map((category, index) => (
							<span key={index} className="text-[10px] text-primary/90 bg-primary/10 px-1.5 py-0.5 rounded-full">
								#{category}
							</span>
						))}
					</div>

					<div className="space-y-0.5">
						<div className="flex items-center gap-1 text-[10px] text-muted-foreground h-4">
							<Calendar className="w-2.5 h-2.5 shrink-0" />
							<span>{formatSeoulDate(group.createdAt)}</span>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-1 p-1.5 bg-muted/50 rounded-lg mt-1">
					{[
						{
							icon: <Users className="w-2.5 h-2.5 text-primary" />,
							value: group.memberCount || 0,
							label: t("Total group members"),
						},
						{
							icon: <Calendar className="w-2.5 h-2.5 text-primary" />,
							value: group.eventsCount || 0,
							label: t("Total events organized"),
						},
						{
							icon: <Heart className="w-2.5 h-2.5 text-primary" />,
							value: group.groupLikes || 0,
							label: t("Total likes received"),
						},
					].map((item, i) => (
						<Tooltip key={i}>
							<TooltipTrigger asChild>
								<div className="flex items-center justify-center gap-0.5 p-1 rounded-md bg-card/70 hover:bg-card transition-colors cursor-help">
									{item.icon}
									<p className="text-[10px] font-medium">{item.value}</p>
								</div>
							</TooltipTrigger>
							<TooltipContent side="bottom">{item.label}</TooltipContent>
						</Tooltip>
					))}
				</div>

				<div className="px-0.5 mt-1">
					<div className="bg-muted/30 p-1.5 rounded-md min-h-[36px] flex items-center">
						{group.groupDesc ? (
							<p className="text-[10px] text-foreground leading-snug line-clamp-2">{group.groupDesc}</p>
						) : (
							<p className="text-[10px] text-muted-foreground italic flex items-center justify-center py-0.5 w-full">
								<span className="bg-muted/50 px-1.5 py-0.5 rounded-md">{t("No description available")}</span>
							</p>
						)}
					</div>
				</div>
			</CardContent>

			<CardFooter className="border-t flex items-center justify-between gap-1 p-1.5">
				<Button
					variant="ghost"
					size="sm"
					className={`h-6 w-6 p-0 transition-all ${group?.meLiked?.[0]?.myFavorite ? "text-rose-500" : ""}`}
					onClick={() => likeGroupHandler(group._id)}
					aria-label={group?.meLiked?.[0]?.myFavorite ? t("Liked") : t("Like")}
				>
					<Heart
						className={`w-3 h-3 transition-all ${group?.meLiked?.[0]?.myFavorite ? "fill-current stroke-current" : ""}`}
					/>
				</Button>

				<Button
					variant={group?.meJoined?.[0]?.meJoined ? "outline" : "default"}
					size="sm"
					className={`h-6 px-2 text-[10px] font-medium transition-all ${
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
						className="h-6 w-6 p-0 rounded-md hover:bg-primary/5 border-primary/30 text-primary"
						aria-label={t("View")}
					>
						<ExternalLink className="w-3 h-3" />
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};

export default GroupCard;
