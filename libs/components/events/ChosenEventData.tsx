import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { REACT_APP_API_URL } from '@/libs/config';
import { Button } from '@/libs/components/ui/button';
import { Event } from '@/libs/types/event/event';
import { Badge } from '@/libs/components/ui/badge';
import { Heart, Eye, Calendar, Clock, MapPin, Users, Plus, Minus, Ticket } from 'lucide-react';
import { cn } from '@/libs/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { Separator } from '@/libs/components/ui/separator';

import { TicketInput } from '@/libs/types/ticket/ticket.input';

interface ChosenEventDataProps {
	event: Event | null;
	purchaseTicketHandler: () => void;
	likeEventHandler: (eventId: string) => void;
	setTicketInput: (ticketInput: TicketInput) => void;
	ticketInput: TicketInput | null;
}

const ChosenEventData = ({
	event,
	purchaseTicketHandler,
	likeEventHandler,
	setTicketInput,
	ticketInput,
}: ChosenEventDataProps) => {
	const { t } = useTranslation('common');

	if (!event) return null;

	const handleQuantityChange = (newQuantity: number) => {
		if (newQuantity < 1 || newQuantity > event.eventCapacity) return;
		// @ts-expect-error
		setTicketInput({ ...ticketInput, ticketQuantity: newQuantity });
	};

	return (
		<Card className="overflow-hidden">
			<div className="relative aspect-[3/2] w-full">
				<Image
					src={`${REACT_APP_API_URL}/${event.eventImage}`}
					alt={event.eventName}
					fill
					className="object-cover"
					priority
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
			</div>
			<CardHeader className="space-y-4">
				<div className="flex justify-between items-start gap-4">
					<div className="space-y-2">
						<CardTitle className="text-3xl font-semibold tracking-tight">{event.eventName}</CardTitle>
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
						<div className="text-sm text-muted-foreground">{t('per ticket')}</div>
					</div>
				</div>

				<div className="flex items-center gap-6">
					<button
						onClick={() => likeEventHandler(event?._id)}
						className={cn(
							'flex items-center gap-2 transition-colors duration-200',
							event?.meLiked?.[0]?.myFavorite
								? 'text-destructive hover:text-destructive/90'
								: 'text-muted-foreground hover:text-primary',
						)}
					>
						<Heart
							className={cn(
								'h-5 w-5 transition-colors duration-200',
								event?.meLiked?.[0]?.myFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground',
							)}
						/>
						<span className="text-sm">
							{event.eventLikes} {t('likes')}
						</span>
					</button>
					<div className="flex items-center gap-2 text-muted-foreground">
						<Eye className="h-5 w-5" />
						<span className="text-sm">
							{event.eventViews} {t('views')}
						</span>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
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
							<span className="text-foreground">
								{event.eventCapacity} {t('capacity')}
							</span>
						</div>
					</div>
					<div className="space-y-4">
						<div>
							<h3 className="text-lg font-semibold mb-2 text-foreground">{t('Description')}</h3>
							<p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.eventDesc}</p>
						</div>
					</div>
				</div>

				<Separator className="my-6" />

				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center gap-2 text-muted-foreground">
						<Ticket className="h-4 w-4" />
						<span className="text-sm">
							{event.eventCapacity - event.attendeeCount} {t('places available')}
						</span>
					</div>
					<div className="flex items-center gap-6">
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8"
								onClick={() => handleQuantityChange(ticketInput!.ticketQuantity - 1)}
							>
								<Minus className="h-4 w-4" />
							</Button>
							<div className="w-12 text-center font-medium">{ticketInput!.ticketQuantity}</div>
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8"
								onClick={() => handleQuantityChange(ticketInput!.ticketQuantity + 1)}
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>
						<div className="text-right">
							<div className="text-sm text-muted-foreground">{t('Total')}</div>
							<div className="text-xl font-bold text-primary">
								${(event.eventPrice * ticketInput!.ticketQuantity).toFixed(2)}
							</div>
						</div>
						<Button
							onClick={purchaseTicketHandler}
							size="lg"
							className="bg-primary/90 hover:bg-primary text-primary-foreground px-8"
						>
							{t('Buy Ticket')}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default ChosenEventData;
