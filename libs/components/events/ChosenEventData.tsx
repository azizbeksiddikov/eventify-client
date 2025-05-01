import { Button } from '../ui/button';
import { Event } from '@/libs/types/event/event';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { Heart, Eye, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/libs/utils';

const ChosenEventData = ({ event }: { event: Event }) => {
	const [isLiked, setIsLiked] = useState(false);

	const handleLike = () => {
		setIsLiked(!isLiked);
	};

	const handlePurchase = () => {
		console.log('Purchasing 1 ticket');
	};

	return (
		<article className="bg-card rounded-xl shadow-sm overflow-hidden border border-border/50">
			<div className="relative aspect-[3/2] w-full">
				<Image
					src={event?.eventImage}
					alt={event.eventName}
					fill
					className="object-cover"
					priority
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
			</div>
			<div className="p-6 space-y-6">
				<header className="flex justify-between items-start gap-4">
					<div className="space-y-2">
						<h1 className="text-3xl font-semibold text-foreground tracking-tight">{event.eventName}</h1>
						<div className="flex flex-wrap gap-2">
							<Badge variant="secondary" className="bg-muted/50 text-muted-foreground">
								{event.eventStatus}
							</Badge>
							{event.eventCategories.map((category) => (
								<Badge key={category} variant="outline" className="border-muted/50 text-muted-foreground">
									{category}
								</Badge>
							))}
						</div>
					</div>
					<div className="text-right">
						<div className="text-2xl font-bold text-primary">${event.eventPrice}</div>
						<div className="text-sm text-muted-foreground">per ticket</div>
					</div>
				</header>

				<div className="flex items-center gap-6">
					<button
						onClick={handleLike}
						className={cn(
							'flex items-center gap-2 transition-colors duration-200',
							isLiked ? 'text-destructive hover:text-destructive/90' : 'text-muted-foreground hover:text-primary',
						)}
					>
						<Heart
							className={cn(
								'h-5 w-5 transition-colors duration-200',
								isLiked ? 'fill-destructive text-destructive' : 'text-muted-foreground',
							)}
						/>
						<span className="text-sm">{event.eventLikes} likes</span>
					</button>
					<div className="flex items-center gap-2 text-muted-foreground">
						<Eye className="h-5 w-5" />
						<span className="text-sm">{event.eventViews} views</span>
					</div>
				</div>

				<div className="grid gap-6 sm:grid-cols-2">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
							<span className="text-foreground">
								{new Date(event.eventDate).toLocaleDateString('en-US', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</span>
						</div>
						<div className="flex items-center gap-3">
							<Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
							<span className="text-foreground">
								{event.eventStartTime} - {event.eventEndTime}
							</span>
						</div>
						<div className="flex items-center gap-3">
							<MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
							<span className="text-foreground">{event.eventAddress}</span>
						</div>
						<div className="flex items-center gap-3">
							<Users className="h-5 w-5 text-muted-foreground flex-shrink-0" />
							<span className="text-foreground">{event.eventCapacity} capacity</span>
						</div>
					</div>
					<div className="space-y-4">
						<div>
							<h3 className="text-lg font-semibold mb-2 text-foreground">Description</h3>
							<p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.eventDesc}</p>
						</div>
					</div>
				</div>

				<div className="pt-6 border-t border-border/50 flex items-center justify-between gap-4">
					<div className="text-sm text-muted-foreground">{event.eventCapacity} places available</div>
					<Button
						onClick={handlePurchase}
						size="lg"
						className="bg-primary/90 hover:bg-primary text-primary-foreground px-8"
					>
						Buy Ticket
					</Button>
				</div>
			</div>
		</article>
	);
};

export default ChosenEventData;
