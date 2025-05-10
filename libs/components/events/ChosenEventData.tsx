import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';

import { Button } from '@/libs/components/ui/button';
import { Badge } from '@/libs/components/ui/badge';
import { Heart, Eye, Calendar, Clock, MapPin, Users, Plus, Minus, Ticket, Pencil } from 'lucide-react';
import { Card } from '@/libs/components/ui/card';
import { Separator } from '@/libs/components/ui/separator';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/libs/components/ui/dialog';

import { REACT_APP_API_URL } from '@/libs/config';
import { cn } from '@/libs/utils';
import { TicketInput } from '@/libs/types/ticket/ticket.input';
import { EventStatus } from '@/libs/enums/event.enum';
import { Event } from '@/libs/types/event/event';

interface ChosenEventDataProps {
	event: Event | null;
	userId: string;
	purchaseTicketHandler: () => void;
	likeEventHandler: (eventId: string) => void;
	setTicketInput: (ticketInput: TicketInput) => void;
	ticketInput: TicketInput | null;
}

const ChosenEventData = ({
	event,
	userId,
	purchaseTicketHandler,
	likeEventHandler,
	setTicketInput,
	ticketInput,
}: ChosenEventDataProps) => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

	if (!event) return null;

	const handleQuantityChange = (newQuantity: number) => {
		if (newQuantity < 1 || newQuantity > event.eventCapacity) return;
		// @ts-expect-error - TicketInput type is not properly defined in the interface
		setTicketInput({ ...ticketInput, ticketQuantity: newQuantity });
	};

	const handlePurchaseClick = () => {
		setIsPaymentDialogOpen(true);
	};

	const handleConfirmPurchase = () => {
		setIsPaymentDialogOpen(false);
		purchaseTicketHandler();
	};

	const getStatusColor = (status: EventStatus) => {
		switch (status) {
			case EventStatus.UPCOMING:
				return 'bg-blue-100 text-blue-800';
			case EventStatus.ONGOING:
				return 'bg-green-100 text-green-800';
			case EventStatus.COMPLETED:
				return 'bg-gray-100 text-gray-800';
			case EventStatus.CANCELLED:
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<>
			<Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl gap-0">
				{/* Section: Event Data */}
				<div className="relative">
					{/* Edit Button */}
					{userId === event.memberId && (
						<Button
							variant="secondary"
							size="sm"
							className="absolute top-4 right-4 z-10 h-9 bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 hover:scale-105 transition-all duration-200"
							onClick={() => router.push(`/event/update?eventId=${event._id}`)}
						>
							<Pencil className="h-4 w-4 mr-1.5" />
							{t('Edit')}
						</Button>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 pb-4">
						{/* Event Name and Image */}
						<div className="relative w-full h-full flex flex-col justify-start items-start">
							<h2 className="text-2xl md:text-3xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-3 text-left">
								{event.eventName}
							</h2>
							<div className="relative aspect-[16/9] w-full group rounded-xl overflow-hidden border-border border-2">
								<Image
									src={`${REACT_APP_API_URL}/${event.eventImage}`}
									alt={event.eventName}
									fill
									className="object-contain transition-transform duration-500"
									priority
									sizes="(max-width: 768px) 100vw, 50vw"
								/>

								<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<div className="absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-t from-black/60 to-transparent rounded-b-xl" />
								<div className="absolute bottom-4 left-4">
									<Badge
										variant="secondary"
										className={`${getStatusColor(event.eventStatus)} backdrop-blur-sm shadow-md px-3 py-1 font-medium`}
									>
										{event.eventStatus}
									</Badge>
								</div>
								<div className="absolute bottom-4 right-4">
									<Badge
										variant="secondary"
										className="bg-primary text-primary-foreground backdrop-blur-sm shadow-md px-3 py-1 font-medium"
									>
										${event.eventPrice}
									</Badge>
								</div>
							</div>
						</div>

						<div className="space-y-6 flex flex-col justify-between">
							{/* Event Info */}
							<div className="space-y-5">
								{/* Event  Categories */}
								<div className="flex flex-wrap gap-2 mt-3">
									{event.eventCategories.map((category) => (
										<Badge
											key={category}
											variant="outline"
											className="text-xs font-medium border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors px-3 py-1 rounded-full"
										>
											{category}
										</Badge>
									))}
								</div>

								{/* Event Date and Time, Location, Capacity */}
								<div className="space-y-3">
									<div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors bg-muted/40 hover:bg-muted/50 p-3 rounded-xl">
										<Calendar className="h-5 w-5 flex-shrink-0 text-primary" />
										<span className="font-medium">
											{new Date(event.eventDate).toLocaleDateString('en-US', {
												weekday: 'short',
												month: 'short',
												day: 'numeric',
												year: 'numeric',
											})}
										</span>
									</div>
									<div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors bg-muted/40 hover:bg-muted/50 p-3 rounded-xl">
										<Clock className="h-5 w-5 flex-shrink-0 text-primary" />
										<span className="font-medium">
											{event.eventStartTime} - {event.eventEndTime}
										</span>
									</div>
									<div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors bg-muted/40 hover:bg-muted/50 p-3 rounded-xl">
										<MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
										<span className="line-clamp-1 font-medium">{event.eventAddress}</span>
									</div>
									<div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors bg-muted/40 hover:bg-muted/50 p-3 rounded-xl">
										<Users className="h-5 w-5 flex-shrink-0 text-primary" />
										<span className="font-medium">
											{event.eventCapacity} {t('capacity')}
										</span>
									</div>
								</div>

								{/* Event Likes and Views */}
								<div className="flex items-center gap-4 pt-2">
									<button
										onClick={() => likeEventHandler(event?._id)}
										className={cn(
											'flex items-center gap-2 transition-all duration-200 hover:scale-105 bg-muted/40 hover:bg-muted/50 p-3 rounded-xl',
											event?.meLiked?.[0]?.myFavorite
												? 'text-destructive hover:text-destructive/90'
												: 'text-muted-foreground hover:text-primary',
										)}
									>
										<Heart
											className={cn(
												'h-5 w-5 transition-all duration-200',
												event?.meLiked?.[0]?.myFavorite ? 'fill-destructive text-destructive' : 'text-primary/70',
											)}
										/>
										<span className="text-sm font-medium">
											{event.eventLikes} {t('likes')}
										</span>
									</button>
									<div className="flex items-center gap-2 text-muted-foreground bg-muted/40 hover:bg-muted/50 transition-colors p-3 rounded-xl">
										<Eye className="h-5 w-5 text-primary/70" />
										<span className="text-sm font-medium">
											{event.eventViews} {t('views')}
										</span>
									</div>
									<div className="flex items-center gap-2 text-muted-foreground bg-muted/40 hover:bg-muted/50 transition-colors p-3 rounded-xl">
										<Ticket className="h-5 w-5 text-primary/70" />
										<span className="text-sm font-medium">
											{event.eventCapacity - event.attendeeCount} {t('places available')}
										</span>
									</div>
								</div>
							</div>

							{/* Ticket Purchase */}
							<div className="bg-accent/30 rounded-xl">
								<div className="flex items-center justify-between flex-wrap gap-4">
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="icon"
											className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors border-primary/20"
											onClick={() => handleQuantityChange(ticketInput!.ticketQuantity - 1)}
										>
											<Minus className="h-4 w-4" />
										</Button>
										<div className="w-10 text-center text-base font-medium">{ticketInput!.ticketQuantity}</div>
										<Button
											variant="outline"
											size="icon"
											className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors border-primary/20"
											onClick={() => handleQuantityChange(ticketInput!.ticketQuantity + 1)}
										>
											<Plus className="h-4 w-4" />
										</Button>
										<div className="text-xs text-muted-foreground">{t('Total')}</div>
										<div className="text-base font-semibold text-primary">
											${(event.eventPrice * ticketInput!.ticketQuantity).toFixed(2)}
										</div>
									</div>
									<Button
										onClick={handlePurchaseClick}
										size="sm"
										className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground px-6 shadow-sm hover:shadow transition-all duration-200"
									>
										{t('Buy Ticket')}
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Section: Description */}
				<Separator />
				<div className="px-6 py-4">
					<h3 className="text-sm font-medium mb-2 text-foreground/90">{t('Description')}</h3>
					<p className="text-sm text-muted-foreground leading-relaxed">{event.eventDesc}</p>
				</div>
			</Card>

			<Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{t('Confirm Payment')}</DialogTitle>
						<DialogDescription>{t('Do you want to proceed with the payment?')}</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">{t('Price per ticket')}</span>
							<span className="font-medium">${event.eventPrice}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">{t('Number of tickets')}</span>
							<span className="font-medium">{ticketInput!.ticketQuantity}</span>
						</div>
						<Separator />
						<div className="flex justify-between items-center">
							<span className="text-sm font-medium">{t('Total amount')}</span>
							<span className="text-lg font-semibold text-primary">
								${(event.eventPrice * ticketInput!.ticketQuantity).toFixed(2)}
							</span>
						</div>
					</div>
					<DialogFooter className="gap-2 sm:gap-0">
						<Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
							{t('Cancel')}
						</Button>
						<Button onClick={handleConfirmPurchase} className="bg-primary hover:bg-primary/90">
							{t('Confirm Payment')}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ChosenEventData;
