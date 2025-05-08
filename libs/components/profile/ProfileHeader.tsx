import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Calendar, Users, Ticket, Heart, Star, User } from 'lucide-react';

import { getMemberTypeColor, REACT_APP_API_URL } from '@/libs/config';
import { Member } from '@/libs/types/member/member';

interface ProfileHeaderProps {
	member: Member;
	groupsCount: number;
	ticketsCount: number;
}

export const ProfileHeader = ({ member, groupsCount, ticketsCount }: ProfileHeaderProps) => {
	const { t } = useTranslation();
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
		<div className="bg-card rounded-xl shadow-lg p-8 md:p-10 border border-border/50">
			<div className="flex flex-col gap-8">
				<div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
					{/* Profile Section */}
					<div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 flex-1">
						<div className="relative">
							{member.memberImage ? (
								<div className="relative w-28 h-28 md:w-36 md:h-36">
									<Image
										src={`${REACT_APP_API_URL}/${member.memberImage}`}
										alt={member.memberFullName ?? t('No image')}
										className="object-cover rounded-full ring-4 ring-primary/10"
										fill
									/>
								</div>
							) : (
								<div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-muted flex items-center justify-center ring-4 ring-primary/10">
									<User className="h-14 w-14 md:h-20 md:w-20 text-muted-foreground/50" />
								</div>
							)}
						</div>
						<div className="flex flex-col items-center md:items-start space-y-4  h-full justify-around">
							<div className="flex flex-col items-center md:items-start gap-3 justify-between ">
								<h1 className="text-3xl md:text-4xl font-bold text-card-foreground tracking-tight">
									{member.memberFullName}
								</h1>
								<div className="flex items-center gap-3">
									<p className="text-muted-foreground text-lg md:text-xl font-medium">@{member.username}</p>
									<span
										className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getMemberTypeColor(member.memberType)}`}
									>
										{member.memberType}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Stats Section */}
					<div className="bg-muted/30 rounded-xl backdrop-blur-sm p-6">
						<div className="flex flex-wrap justify-center gap-6">
							{stats.map((stat, index) => (
								<div key={index} className="flex flex-col items-center min-w-[120px] p-4 rounded-lg bg-card/50">
									<div className="flex items-center gap-2 mb-1">
										<stat.icon className="h-5 w-5 text-primary" />
										<span className="text-2xl font-bold text-card-foreground">{stat.value}</span>
									</div>
									<span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Description Section */}
				{member.memberDesc && (
					<div className="border-t border-border/50 pt-4">
						<p className="text-card-foreground/80 text-base md:text-lg text-left leading-relaxed">
							{member.memberDesc ?? t('No description')}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};
