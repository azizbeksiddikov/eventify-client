import { Group } from '@/libs/types/group/group';
import { Users, Heart, LogIn, LogOut, Calendar, Clock, Link as LinkIcon } from 'lucide-react';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '@/apollo/store';
import { MemberType } from '@/libs/enums/member.enum';
import { Button } from '@/libs/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/libs/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/libs/components/ui/avatar';
import { REACT_APP_API_URL } from '@/libs/config';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

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
		<div className="bg-card rounded-xl shadow-sm">
			<div className="px-6 py-4 border-b border-border">
				<h2 className="text-lg font-medium text-card-foreground">
					{user.memberType === MemberType.ORGANIZER ? t('Groups Organized') : t('Groups Joined')}
				</h2>
			</div>
			<div className="divide-y divide-border">
				{groups.length === 0 ? (
					<div className="px-6 py-8 text-center text-muted-foreground">{t('No groups found')}</div>
				) : (
					groups.map((group) => {
						const isJoined = group?.meJoined?.[0]?.meJoined;
						const isLiked = group?.meLiked?.[0]?.myFavorite;
						const createdAt = group.createdAt
							? formatDistanceToNow(new Date(group.createdAt), { addSuffix: true })
							: '';

						return (
							<div key={group._id} className="px-6 py-4 hover:bg-muted/50 transition-colors duration-200">
								<div className="flex items-center justify-between gap-4">
									{/* Left Section - Group Image and Name */}
									<div className="flex items-center gap-3 min-w-[200px]">
										<Avatar className="h-12 w-12 ring-2 ring-primary/10">
											<AvatarImage
												src={`${REACT_APP_API_URL}/${group.groupImage}`}
												alt={group.groupName}
												className="object-cover"
											/>
											<AvatarFallback className="bg-muted">
												<Users className="h-6 w-6 text-muted-foreground" />
											</AvatarFallback>
										</Avatar>
										<div>
											<div className="flex items-center gap-2">
												<h3 className="text-base font-medium text-card-foreground">{group.groupName}</h3>
												{group.meOwner && (
													<Badge variant="secondary" className="text-xs">
														{t('Owner')}
													</Badge>
												)}
											</div>
										</div>
									</div>

									{/* Center Section - Stats and Info */}
									<div className="flex items-center gap-6 flex-1 justify-center">
										<div className="flex items-center gap-2">
											<Users className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm text-muted-foreground">
												{group.memberCount} {t('members')}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Calendar className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm text-muted-foreground">
												{group?.eventsCount ?? 0} {t('events')}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Clock className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm text-muted-foreground">{createdAt}</span>
										</div>
									</div>

									{/* Right Section - Actions */}
									<div className="flex items-center gap-2 min-w-[120px] justify-end">
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
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};
