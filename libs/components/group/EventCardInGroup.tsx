import Image from 'next/image';
import Link from 'next/link';
import { REACT_APP_API_URL } from '@/libs/config';
import { Badge } from '@/libs/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/libs/components/ui/card';
import { Button } from '@/libs/components/ui/button';
import { Users, Calendar, MapPin, Heart, ExternalLink } from 'lucide-react';
import { Event } from '@/libs/types/event/event';
import { useState } from 'react';

interface EventCardInGroupProps {
	event: Event;
}

const EventCardInGroup = ({ event }: EventCardInGroupProps) => {
	const [isLiked, setIsLiked] = useState(false);
	const handleLike = () => {
		setIsLiked(!isLiked);
	};

	return (
		<Card className="pt-0 w-full mx-auto shadow-md hover:shadow-lg transition-all duration-300 bg-card/60 flex flex-col h-[600px] group">
			<div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl">
				<Link href={`/events/detail?id=${event._id}`}>
					<Image
						src={`${REACT_APP_API_URL}/${event.eventImage}`}
						alt={event.eventName}
						fill
						className="object-cover transition-transform duration-300"
					/>
				</Link>
			</div>

			<CardContent className="space-y-6 p-6 flex-1">
				<div className="space-y-3">
					<h3 className="text-2xl font-semibold text-foreground line-clamp-1">{event.eventName}</h3>
					<Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200">
						<Users className="h-3 w-3 mr-1" />
						{event.attendeeCount} going
					</Badge>
				</div>

				<div className="grid grid-cols-2 gap-3 p-4 bg-muted/50 rounded-xl">
					<div className="flex items-center gap-2 p-2 rounded-md bg-card/70 hover:bg-card transition-colors">
						<Calendar className="h-4 w-4 text-primary" />
						<p className="text-sm">
							{event.eventDate.toLocaleDateString('en-GB', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric',
							})}
						</p>
					</div>
					<div className="flex items-center gap-2 p-2 rounded-md bg-card/70 hover:bg-card transition-colors">
						<MapPin className="h-4 w-4 text-primary" />
						<p className="text-sm line-clamp-1">{event.eventAddress}</p>
					</div>
				</div>

				<div className="px-1">
					<div className="relative">
						<div className="bg-muted/30 p-4 rounded-lg">
							<p className="text-sm text-foreground leading-relaxed line-clamp-4">{event.eventDesc}</p>
						</div>
					</div>
				</div>
			</CardContent>

			<CardFooter className="pt-4 border-t border-border flex items-center justify-between gap-3 mt-auto">
				<Button
					variant="ghost"
					size="sm"
					onClick={handleLike}
					className={`h-10 px-4 font-medium transition-all rounded-lg ${
						isLiked
							? 'text-rose-500 hover:text-rose-600 hover:bg-rose-50/30'
							: 'hover:text-rose-500 hover:bg-rose-50/20'
					}`}
				>
					<Heart className={`h-4 w-4 mr-1.5 transition-all ${isLiked ? 'fill-current stroke-current' : ''}`} />
					{isLiked ? 'Liked' : 'Like'}
				</Button>

				<Link href={`/events/detail?id=${event._id}`} className="flex-1">
					<Button
						variant="outline"
						size="sm"
						className="h-10 w-full rounded-lg hover:bg-primary/5 border-primary/30 text-primary transition-colors"
					>
						<ExternalLink className="h-4 w-4 mr-1.5" />
						View
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};

export default EventCardInGroup;
