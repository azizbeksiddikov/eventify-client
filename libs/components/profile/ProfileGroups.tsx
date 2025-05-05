import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useReactiveVar } from '@apollo/client';
import { Users, Heart, LogIn, LogOut, Calendar, Clock, Link as LinkIcon } from 'lucide-react';

import { Avatar, AvatarImage, AvatarFallback } from '@/libs/components/ui/avatar';
import { Button } from '@/libs/components/ui/button';
import { Badge } from '@/libs/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/libs/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/libs/components/ui/table';

import { userVar } from '@/apollo/store';
import { REACT_APP_API_URL } from '@/libs/config';
import { Group } from '@/libs/types/group/group';

interface ProfileGroupsProps {
	groups: Group[];
	likeGroupHandler: (groupId: string) => void;
	handleJoinGroup: (groupId: string) => void;
	handleLeaveGroup: (groupId: string) => void;
}

export const ProfileGroups = ({ groups, likeGroupHandler, handleJoinGroup, handleLeaveGroup }: ProfileGroupsProps) => {
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');

	return (
		<Card className="w-full">
			<CardHeader>
				<h2 className="text-lg font-medium text-card-foreground">{t('Groups Joined')}</h2>
			</CardHeader>
			<CardContent>
				{groups.length === 0 ? (
					<div className="text-center text-muted-foreground py-8">{t('No groups found')}</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[300px]">{t('Group')}</TableHead>
								<TableHead className="text-center">{t('Members')}</TableHead>
								<TableHead className="text-center">{t('Events')}</TableHead>
								<TableHead className="text-center">{t('Created')}</TableHead>
								<TableHead className="text-right">{t('Actions')}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{groups.map((group) => {
								const isJoined = group?.meJoined?.[0]?.meJoined;
								const isLiked = group?.meLiked?.[0]?.myFavorite;
								const createdAt = group.createdAt
									? formatDistanceToNow(new Date(group.createdAt), { addSuffix: true })
									: '';

								return (
									<TableRow key={group._id} className="hover:bg-muted/50">
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar className="h-10 w-10 ring-2 ring-primary/10">
													<AvatarImage
														src={`${REACT_APP_API_URL}/${group.groupImage}`}
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
																{t('Owner')}
															</Badge>
														)}
													</div>
												</div>
											</div>
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
															? 'text-destructive hover:text-destructive/80'
															: 'text-muted-foreground hover:text-destructive'
													} transition-colors duration-200`}
													aria-label={isLiked ? t('Unlike group') : t('Like group')}
												>
													<Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
												</Button>
												{isJoined ? (
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleLeaveGroup(group._id)}
														className="text-destructive hover:text-destructive/80 transition-colors duration-200"
														aria-label={t('Leave group')}
													>
														<LogOut className="h-4 w-4" />
													</Button>
												) : (
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleJoinGroup(group._id)}
														className="text-muted-foreground hover:text-primary transition-colors duration-200"
														aria-label={t('Join group')}
													>
														<LogIn className="h-4 w-4" />
													</Button>
												)}
												<Link href={`/group/detail?groupId=${group._id}`}>
													<Button
														variant="ghost"
														size="icon"
														className="text-muted-foreground hover:text-primary transition-colors duration-200"
														aria-label={t('View group details')}
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
