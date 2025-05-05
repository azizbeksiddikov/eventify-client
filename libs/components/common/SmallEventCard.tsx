import Link from 'next/link';
import Image from 'next/image';
import { REACT_APP_API_URL } from '@/libs/config';
import { MapPin, Calendar, Heart, Eye } from 'lucide-react';
import { Button } from '@/libs/components/ui/button';
import { Event } from '@/libs/types/event/event';

interface EventCardProps {
	event: Event;
	likeEventHandler: (eventId: string) => void;
}

const SmallEventCard = ({ event, likeEventHandler }: EventCardProps) => {
	return (
		<div className="p-4 rounded-lg hover:bg-secondary/20 hover:border-l-4 hover:border-l-primary transition-all duration-300">
			<div className="flex items-center gap-4">
				{/* Image and Description Column */}
				<Link href={`/event/detail?eventId=${event._id}`} className="flex-1 flex items-center gap-4 group">
					{/* Image */}
					<div className="flex-shrink-0">
						<div className="w-20 h-20 rounded-xl overflow-hidden relative">
							<Image
								src={`${REACT_APP_API_URL}/${event.eventImage}`}
								alt={event.eventName}
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
								width={80}
								height={80}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
						</div>
					</div>

					{/* Description */}
					<div className="flex-1 min-w-0">
						<h4 className="text-base font-semibold text-card-foreground group-hover:text-card-foreground transition-colors duration-200 line-clamp-1">
							{event.eventName}
						</h4>
						<div className="mt-2 flex items-center gap-4 text-sm text-card-foreground/70">
							<div className="flex items-center">
								<Calendar className="w-3.5 h-3.5 mr-1.5 text-card-foreground/70" />
								{new Date(event.eventDate).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
									year: 'numeric',
								})}
							</div>
							<div className="flex items-center">
								<MapPin className="w-3.5 h-3.5 mr-1.5 text-card-foreground/70" />
								<span className="line-clamp-1">{event.eventCity}</span>
							</div>
						</div>
					</div>
				</Link>

				{/* Views and Like Column */}
				<div className="flex flex-col items-end gap-2">
					<div className="flex items-center">
						<Eye className="w-3.5 h-3.5 mr-1.5 text-card-foreground/70" />
						<span className="text-sm text-card-foreground/70">{event.eventViews.toLocaleString()}</span>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => likeEventHandler(event?._id)}
						className="text-card-foreground/70 hover:text-primary transition-colors duration-200 hover:bg-primary/10"
					>
						<Heart
							className={`h-4 w-4 transition-all duration-200 ${event?.meLiked?.[0]?.myFavorite ? 'fill-primary text-primary' : ''}`}
						/>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SmallEventCard;
