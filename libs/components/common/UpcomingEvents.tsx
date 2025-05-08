import { useTranslation } from 'next-i18next';

import { Calendar } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/libs/components/ui/carousel';
import { Card } from '@/libs/components/ui/card';

import { Event } from '@/libs/types/event/event';
import EventCard from './EventCard';

interface UpcomingEventsProps {
	events: Event[];
	organizerName?: string;
	likeEventHandler: (eventId: string) => Promise<void>;
}

const UpcomingEvents = ({ events, organizerName, likeEventHandler }: UpcomingEventsProps) => {
	const { t } = useTranslation('common');

	if (events.length === 0) {
		return (
			<Card className="mt-10 p-8 bg-card hover:bg-accent/5 transition-all duration-300 shadow-sm hover:shadow-md border border-border/50">
				<h2 className="text-2xl font-semibold mb-6 text-card-foreground flex items-center gap-2">
					<Calendar className="w-5 h-5 text-card-foreground" />
					{t('No Upcoming Events in a month')}
				</h2>
			</Card>
		);
	} else {
		return (
			<Card className="mt-10 p-8 bg-card hover:bg-accent/5 transition-all duration-300 shadow-sm hover:shadow-md border border-border/50">
				<h2 className="text-2xl font-semibold mb-6 text-card-foreground flex items-center gap-2">
					<Calendar className="w-5 h-5 text-card-foreground" />
					{t('Upcoming Events ')}
					{organizerName ? (
						<>
							{t('by')}
							<span className="text-primary">{organizerName}</span>
						</>
					) : (
						''
					)}
					{events.length > 0 ? ` (${events.length})` : ''} {t('in a month')}
				</h2>

				<Carousel
					opts={{
						align: 'start',
					}}
					className="w-[90%] mx-auto"
				>
					<CarouselContent className="p-4">
						{events.map((event) => (
							<CarouselItem key={event._id} className="md:basis-1/2 lg:basis-1/3">
								<div className="p-2">
									<EventCard event={event} likeEventHandler={likeEventHandler} />
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</Card>
		);
	}
};

export default UpcomingEvents;
