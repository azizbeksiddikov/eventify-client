import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Card } from '@/libs/components/ui/card';
import SmallEventCard from '@/libs/components/common/SmallEventCard';
import { Users, Calendar } from 'lucide-react';
import Owner from '@/libs/components/common/Owner';
import { Event } from '@/libs/types/event/event';

interface ChosenEventOtherProps {
	event: Event | null;
	likeEventHandler: (eventId: string) => void;
}

const ChosenEventOther = ({ event, likeEventHandler }: ChosenEventOtherProps) => {
	const { t } = useTranslation('common');

	if (!event) return null;

	return (
		<div className="space-y-8">
			{/* Owner's Info */}
			{event?.memberData && <Owner member={event.memberData} />}

			{/* Hosting Group */}
			{event?.hostingGroup && (
				<Link
					href={`/groups/detail?groupId=${event.hostingGroup._id}`}
					className="block group hover:scale-[1.02] transition-all duration-300"
				>
					<Card className="p-8 bg-card hover:bg-secondary/15 transition-all duration-300 shadow-sm hover:shadow-md border border-border/50">
						<h2 className="text-2xl font-semibold mb-6 text-card-foreground flex items-center gap-2">
							<Calendar className="w-5 h-5 text-card-foreground" />
							{t('Hosting Group')}
						</h2>
						<div className="flex items-center space-x-6">
							<div className="flex-shrink-0">
								<div className="w-20 h-20 rounded-xl overflow-hidden relative">
									<Image
										src={event.hostingGroup.groupImage}
										alt={event.hostingGroup.groupName}
										fill
										className="object-cover group-hover:scale-105 transition-transform duration-200"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
								</div>
							</div>
							<div className="space-y-2">
								<h3 className="text-xl font-semibold text-card-foreground group-hover:text-card-foreground transition-colors duration-200">
									{event.hostingGroup.groupName}
								</h3>
								<p className="text-base text-card-foreground leading-relaxed group-hover:text-card-foreground/80 transition-colors duration-200">
									{event.hostingGroup.groupDesc}
								</p>
								<div className="flex items-center space-x-6 pt-2">
									<div className="flex items-center gap-2 text-sm text-card-foreground">
										<Users className="w-4 h-4 text-card-foreground/70" />
										<span>
											{event.hostingGroup.memberCount} {t('members')}
										</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-card-foreground">
										<Calendar className="w-4 h-4 text-card-foreground/70" />
										<span>
											{event.hostingGroup.eventsCount} {t('events')}
										</span>
									</div>
								</div>
							</div>
						</div>
					</Card>
				</Link>
			)}
			{/* Similar Events */}
			<Card className="p-6 bg-card hover:bg-secondary/15 transition-all duration-300 shadow-sm hover:shadow-md border border-border/50">
				<h2 className="text-2xl font-semibold mb-6 text-card-foreground flex items-center gap-2">
					{t('Similar Events')}
				</h2>
				<div className="space-y-4">
					{event?.similarEvents?.map((similarEvent) => (
						<SmallEventCard key={similarEvent._id} event={similarEvent} likeEventHandler={likeEventHandler} />
					))}
				</div>
			</Card>
		</div>
	);
};

export default ChosenEventOther;
