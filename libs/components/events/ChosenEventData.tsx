import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Heart, Eye, Calendar, Clock, MapPin, Users, Plus, Minus, Ticket, Pencil } from 'lucide-react';

import { Button } from '@/libs/components/ui/button';
import { Badge } from '@/libs/components/ui/badge';
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
	ticketInput: TicketInput;
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

	const quantityHandler = (change: number) => {
		const newQuantity = ticketInput!.ticketQuantity + change;
		if (newQuantity < 1 || newQuantity > event.eventCapacity) return;
		setTicketInput({ ...ticketInput, ticketQuantity: newQuantity });
	};

	const purchaseHandler = () => {
		setIsPaymentDialogOpen(true);
	};

	const confirmPurchaseHandler = () => {
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

	const isLiked = event.meLiked && event.meLiked.length > 0;
	return (
		<>
			<Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl gap-0 py-0">
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

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 pb-4">
						{/* Event Name and Image */}
						<div className="relative w-full flex flex-col justify-start items-start">
							<h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-3 text-left">
								{event.eventName}
							</h2>
							{/* Event Image */}
							<div className="relative aspect-[16/9] w-full group rounded-xl overflow-hidden border-border border-2">
								<Image
									src={`${REACT_APP_API_URL}/${event.eventImage}`}
									alt={event.eventName}
									fill
									className="object-contain transition-transform duration-500"
									sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
								/>

								<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<div className="absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-t from-black/60 to-transparent rounded-b-xl" />
								<div className="absolute bottom-4 left-4">
									<Badge
										variant="secondary"
										className={`${getStatusColor(event.eventStatus)} backdrop-blur-sm shadow-md px-2 sm:px-3 py-1 font-medium`}
									>
										{event.eventStatus}
									</Badge>
								</div>
								<div className="absolute bottom-4 right-4">
									<Badge
										variant="secondary"
										className="bg-primary text-primary-foreground backdrop-blur-sm shadow-md px-2 sm:px-3 py-1 font-medium"
									>
										${event.eventPrice}
									</Badge>
								</div>
							</div>
						</div>

						<div className="space-y-6 flex flex-col justify-between">
							{/* Event Info */}
							<div className="space-y-5">
								{/* Event Categories */}
								<div className="flex flex-wrap gap-2 mt-3">
									{event.eventCategories.map((category) => (
										<Badge
											key={category}
											variant="outline"
											className="text-xs font-medium border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors px-2 sm:px-3 py-1 rounded-full"
										>
											{category}
										</Badge>
									))}
								</div>

								{/* Event Date and Time, Location, Capacity */}
								<div className="space-y-3">
									{/* Event Date */}
									<div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors bg-muted/40 hover:bg-muted/50 p-2 sm:p-3 rounded-xl">
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

									{/* Event Time */}
									<div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors bg-muted/40 hover:bg-muted/50 p-2 sm:p-3 rounded-xl">
										<Clock className="h-5 w-5 flex-shrink-0 text-primary" />
										<span className="font-medium">
											{event.eventStartTime} - {event.eventEndTime}
										</span>
									</div>

									{/* Event Location */}
									<div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors bg-muted/40 hover:bg-muted/50 p-2 sm:p-3 rounded-xl">
										<MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
										<span className="line-clamp-1 font-medium">{event.eventAddress}</span>
									</div>
									<div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors bg-muted/40 hover:bg-muted/50 p-2 sm:p-3 rounded-xl">
										<Users className="h-5 w-5 flex-shrink-0 text-primary" />
										<span className="font-medium">
											{event.eventCapacity} {t('capacity')}
										</span>
									</div>
								</div>

								{/* Event Likes and Views */}
								<div className="grid grid-cols-3 gap-2 h-10">
									{/* Event Likes */}
									<Button
										onClick={() => likeEventHandler(event._id)}
										className={cn(
											'flex h-auto items-center m-0 p-0 justify-center gap-2 text-muted-foreground bg-muted/40 hover:bg-muted/50 transition-colors rounded-xl',
											isLiked
												? 'text-destructive hover:text-destructive/90'
												: 'text-muted-foreground hover:text-primary',
										)}
									>
										<Heart
											className={cn(
												'h-5 w-5 transition-all duration-200',
												isLiked ? 'fill-destructive text-destructive' : 'text-primary/70',
											)}
										/>
										<span className="font-medium">{event.eventLikes}</span>
									</Button>

									{/* Event Views */}
									<div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted/40 hover:bg-muted/50 transition-colors rounded-xl">
										<Eye className="h-5 w-5 text-primary/70" />
										<span className="font-medium">{event.eventViews}</span>
									</div>

									{/* Event Remaining Capacity */}
									<div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted/40 hover:bg-muted/50 transition-colors rounded-xl">
										<Ticket className="h-5 w-5 text-primary/70" />
										<span className="font-medium">{event.eventCapacity - event.attendeeCount}</span>
									</div>
								</div>
							</div>

							{/* Ticket Purchase */}
							<div className="bg-accent/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								{/* Ticket Quantity and Total Price */}
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="icon"
											className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors border-primary/20"
											onClick={() => quantityHandler(-1)}
										>
											<Minus className="h-3 w-3" />
										</Button>

										<div className="w-8 text-center font-medium">{ticketInput!.ticketQuantity}</div>

										<Button
											variant="outline"
											size="icon"
											className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors border-primary/20"
											onClick={() => quantityHandler(1)}
										>
											<Plus className="h-3 w-3" />
										</Button>
									</div>
									<div className="flex items-center gap-2">
										<div className="text-muted-foreground">{t('Total')}</div>
										<div className="font-semibold text-primary">
											${(event.eventPrice * ticketInput!.ticketQuantity).toFixed(2)}
										</div>
									</div>
								</div>

								{/* Buy Ticket Button */}
								<Button
									onClick={purchaseHandler}
									size="sm"
									className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 shadow-sm hover:shadow transition-all duration-200 w-full sm:w-auto"
								>
									{t('Buy Ticket')}
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* Section: Description */}
				<Separator />
				<div className="px-4 sm:px-6 py-4">
					<h3 className="font-medium mb-2 text-foreground/90">{t('Description')}</h3>
					<p className="text-muted-foreground leading-relaxed">{event.eventDesc}</p>
				</div>
			</Card>

			<Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
				<DialogContent className="sm:max-w-md max-w-[90vw] rounded-lg">
					<DialogHeader>
						<DialogTitle>{t('Confirm Payment')}</DialogTitle>
						<DialogDescription>{t('Do you want to proceed with the payment?')}</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="flex justify-between items-center">
							<span className="text-muted-foreground">{t('Price per ticket')}</span>
							<span className="font-medium">${event.eventPrice}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-muted-foreground">{t('Number of tickets')}</span>
							<span className="font-medium">{ticketInput!.ticketQuantity}</span>
						</div>
						<Separator />
						<div className="flex justify-between items-center">
							<span className="font-medium">{t('Total amount')}</span>
							<span className="font-semibold text-primary">
								${(event.eventPrice * ticketInput!.ticketQuantity).toFixed(2)}
							</span>
						</div>
					</div>
					<DialogFooter className="flex-col sm:flex-row gap-2">
						<Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} className="w-full sm:w-auto">
							{t('Cancel')}
						</Button>
						<Button onClick={confirmPurchaseHandler} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
							{t('Confirm Payment')}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ChosenEventData;
