import { useTranslation } from 'react-i18next';
import { User, Heart, UserMinus, Users, Calendar } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/libs/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/libs/components/ui/avatar';
import { Button } from '@/libs/components/ui/button';
import { Badge } from '@/libs/components/ui/badge';

import { Member } from '@/libs/types/member/member';
import { getMemberTypeColor, REACT_APP_API_URL } from '@/libs/config';

interface ProfileFollowingsProps {
	followings: Member[];
	likeMemberHandler: (memberId: string) => void;
	unsubscribeHandler: (memberId: string) => void;
}

export const ProfileFollowings = ({ followings, likeMemberHandler, unsubscribeHandler }: ProfileFollowingsProps) => {
	const { t } = useTranslation('common');

	return (
		<div className="bg-card rounded-xl shadow-sm">
			<div className="px-6 py-4 border-b border-border">
				<h2 className="text-lg font-medium text-card-foreground">{t('My Followings')}</h2>
			</div>
			<div className="p-6">
				{followings.length === 0 ? (
					<div className="text-center text-muted-foreground py-8">{t('No followings found')}</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t('User')}</TableHead>
								<TableHead className="text-center">{t('Type')}</TableHead>
								<TableHead className="text-center">
									<div className="flex items-center justify-center gap-1">
										<Users className="h-4 w-4" />
										{t('Following')}
									</div>
								</TableHead>
								<TableHead className="text-center">
									<div className="flex items-center justify-center gap-1">
										<Users className="h-4 w-4" />
										{t('Followers')}
									</div>
								</TableHead>
								<TableHead className="text-center">
									<div className="flex items-center justify-center gap-1">
										<Calendar className="h-4 w-4" />
										{t('Tickets')}
									</div>
								</TableHead>
								<TableHead className="text-right">{t('Actions')}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{followings.map((user) => {
								const meLiked = user?.meLiked?.[0]?.myFavorite;

								return (
									<TableRow key={user._id} className="hover:bg-muted/50">
										<TableCell>
											<div className="flex items-center gap-4">
												<Avatar className="h-10 w-10">
													{user.memberImage ? (
														<AvatarImage src={`${REACT_APP_API_URL}/${user.memberImage}`} alt={user.memberFullName} />
													) : (
														<AvatarFallback className="bg-muted">
															<User className="h-5 w-5 text-muted-foreground" />
														</AvatarFallback>
													)}
												</Avatar>
												<div>
													<h3 className="font-medium text-card-foreground">{user.memberFullName}</h3>
													<p className="text-sm text-muted-foreground">@{user.username}</p>
												</div>
											</div>
										</TableCell>
										<TableCell className="text-center">
											<Badge variant="outline" className={getMemberTypeColor(user.memberType)}>
												{t(user.memberType)}
											</Badge>
										</TableCell>
										<TableCell className="text-center text-muted-foreground">{user.memberFollowings || 0}</TableCell>
										<TableCell className="text-center text-muted-foreground">{user.memberFollowers || 0}</TableCell>
										<TableCell className="text-center text-muted-foreground">{user.memberEvents || 0}</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-2">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => likeMemberHandler(user._id)}
													className={`${meLiked ? 'text-destructive' : 'text-muted-foreground'} hover:text-destructive`}
												>
													<Heart className={`h-4 w-4 ${meLiked ? 'fill-current' : ''}`} />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => unsubscribeHandler(user._id)}
													className="text-destructive hover:text-destructive/80"
												>
													<UserMinus className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	);
};
