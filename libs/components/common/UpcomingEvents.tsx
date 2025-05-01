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
import EventCardInGroup from '../group/EventCardInGroup';
import { Calendar } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface UpcomingEventsProps {
	events: Event[];
	memberName?: string;
}

const UpcomingEvents = ({ events, memberName }: UpcomingEventsProps) => {
	const [api, setApi] = useState<CarouselApi>();
	const [selectedIndex, setSelectedIndex] = useState(0);

	const onSelect = useCallback(() => {
		if (!api) return;
		setSelectedIndex(api.selectedScrollSnap());
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
				Upcoming Events {memberName ? ` by ${memberName}` : ''}
			</h2>
			<Carousel
				opts={{
					align: 'start',
					loop: true,
				}}
				setApi={setApi}
				className="w-full flex items-center justify-center gap-2"
			>
				<CarouselPrevious className="static translate-y-0 hover:bg-accent/10 transition-colors duration-200" />
				<CarouselContent className="-ml-2 md:-ml-4">
					{events.map((event) => (
						<CarouselItem key={event._id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
							<div className="p-1">
								<EventCardInGroup event={event} />
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselNext className="static translate-y-0 hover:bg-accent/10 transition-colors duration-200" />
			</Carousel>
			<div className="flex justify-center gap-2 mt-4">
				{events.map((_, index) => (
					<button
						key={index}
						className={`w-2 h-2 rounded-full transition-all duration-300 ${
							index === selectedIndex ? 'bg-primary w-4' : 'bg-muted-foreground/20'
						}`}
						onClick={() => api?.scrollTo(index)}
					/>
				))}
			</div>
		</Card>
	);
};

export default UpcomingEvents;
