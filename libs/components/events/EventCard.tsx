import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/libs/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/libs/components/ui/card';
import { Heart, Calendar, Users, ExternalLink, MapPin, Eye, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/libs/components/ui/tooltip';
import { Event } from '@/libs/types/event/event';
import { Badge } from '@/libs/components/ui/badge';
import { useTranslation } from 'react-i18next';

interface EventCardProps {
	event: Event;
	likeEventHandler: (eventId: string) => Promise<void>;
}

const EventCard = ({ event, likeEventHandler }: EventCardProps) => {
	const { t } = useTranslation('common');
	const formatTime = (time: string) => {
		return format(new Date(`2000-01-01T${time}`), 'h:mm a');
	};

	return (
		<Card className="pt-0 w-full mx-auto shadow-md hover:shadow-lg transition-all duration-300 bg-card/60 flex flex-col h-full group hover:scale-105 gap-0">
			<CardHeader className="p-0  gap-0">
				<div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl ">
					<Link href={`/events/detail?id=${event._id}`}>
						<Image
							src={event.eventImage}
							alt={event.eventName}
							fill
							className="object-cover transition-transform duration-300 "
						/>
					</Link>
					<div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						<Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm">
							<Eye className="w-4 h-4 mr-1.5" />
							{event.eventViews || 0}
						</Badge>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-5 p-4 flex-1">
				<div className="space-y-2">
					<h3 className="text-2xl font-semibold text-foreground line-clamp-1">{event.eventName}</h3>
					<div className="flex flex-wrap gap-2">
						{event.eventCategories?.map((category, index) => (
							<span key={index} className="text-sm text-primary/90 bg-primary/10 px-2.5 py-0.5 rounded-full">
								#{category}
							</span>
						))}
					</div>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<MapPin className="w-4 h-4" />
						<span className="line-clamp-1">{event.eventAddress}</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Calendar className="w-4 h-4" />
						<span>{format(new Date(event.eventDate), 'MMM d, yyyy')}</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Clock className="w-4 h-4" />
						<span>
							{formatTime(event.eventStartTime)} - {formatTime(event.eventEndTime)}
						</span>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-2 p-3 bg-muted/50 rounded-xl">
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center gap-2 p-2 rounded-md bg-card/70 hover:bg-card transition-colors cursor-help">
								<Users className="h-4 w-4 text-primary" />
								<p className="text-base font-medium">{event.attendeeCount || 0}</p>
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">{t('Total attendees')}</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center gap-2 p-2 rounded-md bg-card/70 hover:bg-card transition-colors cursor-help">
								<Calendar className="h-4 w-4 text-primary" />
								<p className="text-base font-medium">{event.eventCapacity || 0}</p>
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">{t('Event capacity')}</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center gap-2 p-2 rounded-md bg-card/70 hover:bg-card transition-colors cursor-help">
								<Heart className="h-4 w-4 text-primary" />
								<p className="text-base font-medium">{event.eventLikes || 0}</p>
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">{t('Total likes received')}</TooltipContent>
					</Tooltip>
				</div>

				<div className="px-1">
					<div className="relative">
						<div className="bg-muted/30 p-3 rounded-lg">
							{event.eventDesc ? (
								<p className="text-sm text-foreground leading-relaxed line-clamp-3">{event.eventDesc}</p>
							) : (
								<p className="text-sm text-muted-foreground italic flex items-center justify-center py-2">
									<span className="bg-muted/50 px-3 py-1 rounded-md">{t('No description available')}</span>
								</p>
							)}
						</div>
					</div>
				</div>
			</CardContent>

			<CardFooter className="pt-3 border-t border-border flex items-center justify-between gap-2 mt-auto">
				<Button
					variant="ghost"
					size="sm"
					className={`h-10 px-4 font-medium transition-all ${event?.meLiked?.[0]?.myFavorite ? 'text-rose-500' : ''}`}
					onClick={() => likeEventHandler(event._id)}
				>
					<Heart
						className={`h-4 w-4 mr-1.5 transition-all ${event?.meLiked?.[0]?.myFavorite ? 'fill-current stroke-current' : ''}`}
					/>
					{event?.meLiked?.[0]?.myFavorite ? t('Liked') : t('Like')}
				</Button>

				<Link href={`/events/detail?id=${event._id}`}>
					<Button
						variant="outline"
						size="sm"
						className="h-10 rounded-lg hover:bg-primary/5 border-primary/30 text-primary transition-colors"
					>
						<ExternalLink className="h-4 w-4 mr-1.5" />
						{t('View')}
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};

export default EventCard;
