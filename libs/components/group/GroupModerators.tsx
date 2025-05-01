import { GroupMember } from '@/libs/types/groupMembers/groupMember';
import { Card } from '../ui/card';
import { GroupMemberRole } from '@/libs/enums/group.enum';
import Image from 'next/image';
import { Shield, Users } from 'lucide-react';
import { Badge } from '../ui/badge';
import Link from 'next/link';

interface GroupModeratorsProps {
	groupAdmins: GroupMember[];
}

const GroupModerators = ({ groupAdmins }: GroupModeratorsProps) => {
	return (
		<Card className="p-8 bg-card hover:bg-secondary/90 transition-all duration-300 shadow-sm hover:shadow-md border border-border/50">
			<h2 className="text-2xl font-semibold mb-6 text-card-foreground flex items-center gap-2">
				<Users className="w-5 h-5 text-card-foreground" />
				Moderators
			</h2>
			<div className="space-y-6">
				{groupAdmins
					.filter((member) => member.groupMemberRole === GroupMemberRole.MODERATOR)
					.map((moderator: GroupMember) => (
						<Link
							key={moderator._id}
							href={`/organizer/${moderator.memberData?._id}`}
							className="block group hover:scale-105 transition-transform duration-300"
						>
							<div className="flex items-center space-x-6">
								<div className="flex-shrink-0">
									<div className="w-20 h-20 rounded-xl overflow-hidden relative">
										<Image
											src={moderator.memberData?.memberImage ?? '/images/default-avatar.jpg'}
											alt={moderator.memberData?.memberFullName ?? 'Moderator avatar'}
											fill
											className="object-cover group-hover:scale-105 transition-transform duration-200"
										/>
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
											Moderator
										</Badge>
									</div>
									<p className="text-base text-card-foreground leading-relaxed group-hover:text-card-foreground/80 transition-colors duration-200">
										{moderator.memberData?.memberDesc ?? 'No Description'}
									</p>
									<p className="text-sm text-card-foreground/70">Joined {moderator.joinDate.toLocaleDateString()}</p>
								</div>
							</div>
						</Link>
					))}
			</div>
		</Card>
	);
};

export default GroupModerators;
