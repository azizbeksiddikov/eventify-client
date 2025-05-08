import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Shield, User, Users } from 'lucide-react';

import { Card } from '@/libs/components/ui/card';
import { Badge } from '@/libs/components/ui/badge';
import { AvatarImage } from '@/libs/components/ui/avatar';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';

import { GroupMember } from '@/libs/types/groupMembers/groupMember';
import { GroupMemberRole } from '@/libs/enums/group.enum';
import { REACT_APP_API_URL } from '@/libs/config';

interface GroupModeratorsProps {
	groupModerators: GroupMember[];
}

const GroupModerators = ({ groupModerators }: GroupModeratorsProps) => {
	const { t } = useTranslation('common');

	return (
		<Card className="p-8 bg-card hover:bg-secondary/15 transition-all duration-300 shadow-sm hover:shadow-md border border-border/50">
			<h2 className="text-2xl font-semibold mb-6 text-card-foreground flex items-center gap-2">
				<Users className="w-5 h-5 text-card-foreground" />
				{t('Moderators')}
			</h2>
			<div className="space-y-6">
				{groupModerators
					.filter((member) => member.groupMemberRole === GroupMemberRole.MODERATOR)
					.map((moderator: GroupMember) => (
						<Link
							key={moderator._id}
							href={`/organizer/detail?id=${moderator.memberData?._id}`}
							className="block group hover:scale-[1.02] transition-all duration-300 p-4 rounded-lg hover:bg-secondary/20 hover:border-l-4 hover:border-l-primary"
						>
							<div className="flex items-center space-x-6">
								<div className="flex-shrink-0">
									<div className="w-20 h-20 rounded-xl overflow-hidden relative">
										<Avatar className="h-10 w-10">
											{moderator.memberData?.memberImage ? (
												<AvatarImage
													src={`${REACT_APP_API_URL}/${moderator.memberData?.memberImage}`}
													alt={moderator.memberData?.memberFullName ?? 'Moderator avatar'}
													className="object-cover group-hover:scale-105 transition-transform duration-200"
												/>
											) : (
												<AvatarFallback className="bg-muted">
													<User className="h-5 w-5 text-muted-foreground" />
												</AvatarFallback>
											)}
										</Avatar>

										<div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<h3 className="text-xl font-semibold text-card-foreground group-hover:text-card-foreground transition-colors duration-200">
											{moderator.memberData?.memberFullName ?? 'No Name'}
										</h3>
										<Badge variant="secondary" className="bg-blue-100 text-blue-800">
											<Shield className="h-3 w-3 mr-1" />
											{t('Moderator')}
										</Badge>
									</div>
									<p className="text-base text-card-foreground leading-relaxed group-hover:text-card-foreground/80 transition-colors duration-200">
										{moderator.memberData?.memberDesc ?? 'No Description'}
									</p>
								</div>
							</div>
						</Link>
					))}
			</div>
		</Card>
	);
};

export default GroupModerators;
