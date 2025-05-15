import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Users, Calendar } from 'lucide-react';

import { Card } from '@/libs/components/ui/card';
import Owner from '@/libs/components/common/Owner';
import SmallEventCard from '@/libs/components/common/SmallEventCard';

import { REACT_APP_API_URL } from '@/libs/config';
import type { Event } from '@/libs/types/event/event';

interface ChosenEventOtherProps {
	event: Event | null;
	likeEventHandler: (eventId: string) => void;
}

const ChosenEventOther = ({ event, likeEventHandler }: ChosenEventOtherProps) => {
	const { t } = useTranslation('common');

	if (!event) return null;

	return (
		<div className="space-y-3 sm:space-y-4 lg:space-y-6 w-full h-full">
			{/* Owner's Info */}
			{event?.memberData && <Owner member={event.memberData} title={t('Event Organizer')} />}

			{/* Hosting Group */}
			{event?.hostingGroup && (
				<Link
					href={`/group/detail?groupId=${event.hostingGroup._id}`}
					className="block group hover:scale-[1.02] transition-all duration-300 w-full"
				>
					<Card className="p-3 bg-card hover:bg-secondary/15 transition-all duration-300 shadow-sm hover:shadow-md border border-border/50 w-full gap-2">
						<h2 className="text-lg font-semibold mb-2 sm:mb-3 text-card-foreground flex items-center gap-2">
							<Users className="w-4 h-4 text-card-foreground" />
							{t('Hosting Group')}
						</h2>

						{/* Hosting Group Image and Name */}
						<div className="flex items-center gap-2">
							<div className="w-14 h-14 rounded-lg overflow-hidden relative">
								<Image
									src={`${REACT_APP_API_URL}/${event.hostingGroup.groupImage}`}
									alt={event.hostingGroup.groupName}
									fill
									className="object-cover group-hover:scale-105 transition-transform duration-200"
								/>
							</div>
							<div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
							<h3 className="font-semibold text-card-foreground group-hover:text-card-foreground transition-colors duration-200">
								{event.hostingGroup.groupName}
							</h3>
						</div>

						<div className="flex flex-col items-start gap-3 sm:gap-4">
							<div className="space-y-2 w-full">
								<p className="text-card-foreground leading-relaxed group-hover:text-card-foreground/80 transition-colors duration-200">
									{event.hostingGroup.groupDesc.slice(0, 35)}
									{event.hostingGroup.groupDesc.length > 35 ? '...' : ''}
								</p>
								<div className="flex flex-row items-center gap-3 sm:gap-4 pt-1">
									<div className="flex items-center gap-2 text-card-foreground">
										<Users className="w-4 h-4  text-card-foreground/70" />
										<span>
											{event.hostingGroup.memberCount} {t('members')}
										</span>
									</div>
									<div className="flex items-center gap-2 text-card-foreground">
										<Calendar className="w-4 h-4  text-card-foreground/70" />
										<span>
											{event?.hostingGroup.eventsCount ?? 0} {t('events')}
										</span>
									</div>
								</div>
							</div>
						</div>
					</Card>
				</Link>
			)}
			{/* Similar Events */}
			<Card className="p-3 sm:p-4 lg:p-5 bg-card hover:bg-secondary/15 transition-all duration-300 shadow-sm hover:shadow-md border border-border/50 w-full">
				<h2 className="text-lg font-semibold mb-3 text-card-foreground flex items-center gap-2">
					<Calendar className="w-4 h-4 text-card-foreground" />
					{t('Similar Events')}
				</h2>
				<div className="space-y-2 sm:space-y-3">
					{event?.similarEvents?.map((similarEvent) => (
						<SmallEventCard key={similarEvent._id} event={similarEvent} likeEventHandler={likeEventHandler} />
					))}
				</div>
			</Card>
		</div>
	);
};

export default ChosenEventOther;
