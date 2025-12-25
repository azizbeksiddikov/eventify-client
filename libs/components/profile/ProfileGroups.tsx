import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "next-i18next";
import { useReactiveVar } from "@apollo/client/react";
import { Users, Heart, LogIn, LogOut, Calendar, Clock, Link as LinkIcon } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/libs/components/ui/avatar";
import { Button } from "@/libs/components/ui/button";
import { Badge } from "@/libs/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/libs/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/libs/components/ui/table";

import { userVar } from "@/apollo/store";
import { NEXT_APP_API_URL } from "@/libs/config";
import { Group } from "@/libs/types/group/group";

interface ProfileGroupsProps {
	groups: Group[];
	likeGroupHandler: (groupId: string) => void;
	joinGroupHandler: (groupId: string) => void;
	leaveGroupHandler: (groupId: string) => void;
}

export const ProfileGroups = ({
	groups,
	likeGroupHandler,
	joinGroupHandler,
	leaveGroupHandler,
}: ProfileGroupsProps) => {
	const user = useReactiveVar(userVar);
	const { t } = useTranslation("profile");

	return (
		<Card className="w-full">
			<CardHeader>
				<h2 className="text-lg font-medium text-card-foreground">{t("groups_joined")}</h2>
			</CardHeader>
			<CardContent>
				{groups.length === 0 ? (
					<div className="text-center text-muted-foreground py-8">{t("no_groups_found")}</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[300px]">{t("group")}</TableHead>
								<TableHead className="text-center">{t("members")}</TableHead>
								<TableHead className="text-center">{t("events")}</TableHead>
								<TableHead className="text-center">{t("created")}</TableHead>
								<TableHead className="text-right">{t("actions")}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{groups.map((group) => {
								const isJoined = group?.meJoined?.[0]?.meJoined;
								const isLiked = group?.meLiked?.[0]?.myFavorite;
								const createdAt = group.createdAt
									? formatDistanceToNow(new Date(group.createdAt), { addSuffix: true })
									: "";

								return (
									<TableRow key={group._id} className="hover:bg-muted/50">
										<TableCell>
											<Link href={`/groups/${group._id}`}>
												<div className="flex items-center gap-3 underline">
													<Avatar className="h-10 w-10 ring-2 ring-primary/10">
														<AvatarImage
															src={`${NEXT_APP_API_URL}/${group.groupImage}`}
															alt={group.groupName}
															className="object-cover"
														/>
														<AvatarFallback className="bg-muted">
															<Users className="h-5 w-5 text-muted-foreground" />
														</AvatarFallback>
													</Avatar>
													<div>
														<div className="flex items-center gap-2">
															<h3 className="text-sm font-medium text-card-foreground">{group.groupName}</h3>
															{group.memberId === user?._id && (
																<Badge variant="secondary" className="text-xs">
																	{t("owner")}
																</Badge>
															)}
														</div>
													</div>
												</div>
											</Link>
										</TableCell>
										<TableCell className="text-center">
											<div className="flex items-center justify-center gap-2">
												<Users className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm text-muted-foreground">{group.memberCount}</span>
											</div>
										</TableCell>
										<TableCell className="text-center">
											<div className="flex items-center justify-center gap-2">
												<Calendar className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm text-muted-foreground">{group?.eventsCount ?? 0}</span>
											</div>
										</TableCell>
										<TableCell className="text-center">
											<div className="flex items-center justify-center gap-2">
												<Clock className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm text-muted-foreground">{createdAt}</span>
											</div>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-2">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => likeGroupHandler(group._id)}
													className={`${
														isLiked
															? "text-destructive hover:text-destructive/80"
															: "text-muted-foreground hover:text-destructive"
													} transition-colors duration-200`}
													aria-label={isLiked ? t("unlike") : t("like")}
												>
													<Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
												</Button>
												{isJoined ? (
													<Button
														variant="ghost"
														size="icon"
														onClick={() => leaveGroupHandler(group._id)}
														className="text-destructive hover:text-destructive/80 transition-colors duration-200"
														aria-label={t("leave_group")}
													>
														<LogOut className="h-4 w-4" />
													</Button>
												) : (
													<Button
														variant="ghost"
														size="icon"
														onClick={() => joinGroupHandler(group._id)}
														className="text-muted-foreground hover:text-primary transition-colors duration-200"
														aria-label={t("join_group")}
													>
														<LogIn className="h-4 w-4" />
													</Button>
												)}
												<Link href={`/groups/${group._id}`}>
													<Button
														variant="ghost"
														size="icon"
														className="text-muted-foreground hover:text-primary transition-colors duration-200"
														aria-label={t("view_group_details")}
													>
														<LinkIcon className="h-4 w-4" />
													</Button>
												</Link>
											</div>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
};
