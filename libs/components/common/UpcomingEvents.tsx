import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Calendar } from 'lucide-react';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from '@/libs/components/ui/carousel';
import { Card } from '@/libs/components/ui/card';

import { Event } from '@/libs/types/event/event';
import EventCardInGroup from '@/libs/components/group/EventCardInGroup';

interface UpcomingEventsProps {
	events: Event[];
	organizerName?: string;
}

const UpcomingEvents = ({ events, organizerName }: UpcomingEventsProps) => {
	const { t } = useTranslation('common');
	const [api, setApi] = useState<CarouselApi>();

	const onSelect = useCallback(() => {
		if (!api) return;
	}, [api]);

	useEffect(() => {
		if (!api) return;
		onSelect();
		api.on('select', onSelect);
		api.on('reInit', onSelect);
		return () => {
			api.off('select', onSelect);
		};
	}, [api, onSelect]);

	return (
		<Card className="mt-10 p-8 bg-card hover:bg-accent/5 transition-all duration-300 shadow-sm hover:shadow-md border border-border/50">
			<h2 className="text-2xl font-semibold mb-6 text-card-foreground flex items-center gap-2">
				<Calendar className="w-5 h-5 text-card-foreground" />
				{t('Upcoming Events')} {organizerName ? ` ${t('by')} ${organizerName}` : ''}{' '}
				{events.length > 0 ? ` (${events.length})` : ''}
			</h2>
			<Carousel
				opts={{
					align: 'start',
					loop: true,
					inViewThreshold: 0.5,
					skipSnaps: false,
					dragFree: true,
					containScroll: 'trimSnaps',
				}}
				setApi={setApi}
				className="w-full flex items-center justify-center gap-2"
			>
				<CarouselPrevious className="static translate-y-0 hover:bg-accent/10 transition-colors duration-200" />
				<CarouselContent className="-ml-2 md:-ml-4">
					{events.map((event) => (
						<CarouselItem
							key={event._id}
							className={`pl-2 md:pl-4 ${
								events.length <= 2 ? 'md:basis-full lg:basis-1/2' : 'md:basis-1/2 lg:basis-1/3'
							}`}
						>
							<div className="p-1">
								<EventCardInGroup event={event} />
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselNext className="static translate-y-0 hover:bg-accent/10 transition-colors duration-200" />
			</Carousel>
		</Card>
	);
};

export default UpcomingEvents;
