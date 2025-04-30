import Link from 'next/link';
import { MapPin, Calendar, Heart, Eye } from 'lucide-react';
import { Button } from '@/libs/components/ui/button';
import { Event } from '@/libs/types/event/event';
import { useState } from 'react';

interface EventCardProps {
	event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
	const [isLiked, setIsLiked] = useState(false);

	return (
		<Link
			href={`/events/${event._id}`}
			className="block group hover:bg-muted/50 rounded-xl p-3 transition-all duration-200 hover:shadow-md border border-border/50"
		>
			<div className="flex gap-4">
				<div className="flex-shrink-0">
					<div className="w-20 h-20 rounded-xl overflow-hidden relative">
						<img
							src={event.eventImage}
							alt={event.eventName}
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
					</div>
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between">
						<h4 className="text-base font-semibold text-foreground group-hover:text-primary line-clamp-1">
							{event.eventName}
						</h4>
						<Button
							variant="ghost"
							size="sm"
							onClick={(e) => {
								e.preventDefault();
								setIsLiked(!isLiked);
							}}
							className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:bg-primary/10"
						>
							<Heart className={`h-4 w-4 transition-all duration-200 ${isLiked ? 'fill-primary text-primary' : ''}`} />
						</Button>
					</div>
					<div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
						<div className="flex items-center">
							<Calendar className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
							{new Date(event.eventDate).toLocaleDateString('en-US', {
								month: 'short',
								day: 'numeric',
								year: 'numeric',
							})}
						</div>
						<div className="flex items-center">
							<MapPin className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
							<span className="line-clamp-1">{event.eventCity}</span>
						</div>
						<div className="flex items-center ml-auto">
							<Eye className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
							{event.eventViews.toLocaleString()}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};
