import { useTranslation } from 'react-i18next';
import { Calendar, Users, Ticket, Heart, Star } from 'lucide-react';
import { Member } from '@/libs/types/member/member';

interface ProfileStatsProps {
	member: Member;
	groupsCount: number;
	ticketsCount: number;
}

export const ProfileStats = ({ member, groupsCount, ticketsCount }: ProfileStatsProps) => {
	const { t } = useTranslation('common');

	const stats = [
		{
			label: t('Points'),
			value: member.memberPoints || 0,
			icon: Star,
		},
		{
			label: t('Groups'),
			value: groupsCount || 0,
			icon: Users,
		},
		{
			label: t('Events'),
			value: member.memberEvents || 0,
			icon: Calendar,
		},
		{
			label: t('Tickets'),
			value: ticketsCount || 0,
			icon: Ticket,
		},
		{
			label: t('Likes'),
			value: member.memberLikes || 0,
			icon: Heart,
		},
	];

	return (
		<div className="bg-card rounded-xl shadow-sm p-6 mb-8">
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
				{stats.map((stat, index) => (
					<div
						key={index}
						className="flex flex-col items-center space-y-1 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
					>
						<span className="text-2xl font-semibold text-card-foreground">{stat.value}</span>
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
