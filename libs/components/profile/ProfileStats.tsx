import { Member } from '@/libs/types/member/member';
import { Calendar, Users, Ticket, Heart } from 'lucide-react';

interface ProfileStatsProps {
	member: Member;
	groupsCount: number;
	ticketsCount: number;
}

export const ProfileStats = ({ member, groupsCount, ticketsCount }: ProfileStatsProps) => {
	const stats = [
		{
			label: 'Groups',
			value: groupsCount || 0,
			icon: Users,
		},
		{
			label: 'Events',
			value: member.memberEvents || 0,
			icon: Calendar,
		},
		{
			label: 'Tickets',
			value: ticketsCount || 0,
			icon: Ticket,
		},
		{
			label: 'Likes',
			value: member.memberLikes || 0,
			icon: Heart,
		},
		{
			label: 'Followings',
			value: member.memberFollowings || 0,
			icon: Users,
		},
		{
			label: 'Followers',
			value: member.memberFollowers || 0,
			icon: Users,
		},
	];

	return (
		<div className="bg-card rounded-xl shadow-sm p-6 mb-8">
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
				{stats.map((stat, index) => (
					<div
						key={index}
						className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-muted/50 transition-colors duration-200"
					>
						<span className="text-2xl md:text-3xl font-semibold text-card-foreground">{stat.value}</span>
						<div className="flex items-center gap-1.5">
							<stat.icon className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">{stat.label}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
