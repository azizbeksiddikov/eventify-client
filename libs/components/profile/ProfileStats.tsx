import { Member } from '@/libs/types/member/member';
import { Calendar, Users, Ticket, Heart } from 'lucide-react';

interface ProfileStatsProps {
	member: Member;
}

export const ProfileStats = ({ member }: ProfileStatsProps) => {
	const stats = [
		{
			label: 'Events',
			value: member.events?.length || 0,
			icon: Calendar,
		},
		{
			label: 'Groups',
			value: member.groups?.length || 0,
			icon: Users,
		},
		{
			label: 'Tickets',
			value: member.memberPoints || 0,
			icon: Ticket,
		},
		{
			label: 'Likes',
			value: member.memberLikes || 0,
			icon: Heart,
		},
	];

	return (
		<div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
				{stats.map((stat, index) => (
					<div
						key={index}
						className="flex flex-col items-center space-y-1 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
					>
						<span className="text-3xl font-semibold text-gray-900">{stat.value}</span>
						<div className="flex items-center space-x-1.5">
							<stat.icon className="h-4 w-4 text-gray-400" />
							<span className="text-sm text-gray-500">{stat.label}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
