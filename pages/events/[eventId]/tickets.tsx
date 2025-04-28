import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { EventInput } from '@/libs/types/event/event.input';
import { Button } from '@/libs/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { Input } from '@/libs/components/ui/input';
import { Label } from '@/libs/components/ui/label';
import { Separator } from '@/libs/components/ui/separator';
import { Calendar, MapPin, Clock, CreditCard } from 'lucide-react';
import LoadingComponent from '@/libs/components/common/LoadingComponent';

const TicketPurchasePage = () => {
	const router = useRouter();
	const { eventId } = router.query;
	const [event, setEvent] = useState<EventInput | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [ticketCount, setTicketCount] = useState(1);
	const [paymentInfo, setPaymentInfo] = useState({
		cardNumber: '',
		expiryDate: '',
		cvv: '',
		cardholderName: '',
	});

	useEffect(() => {
		if (eventId) {
			fetchEventData();
		}
	}, [eventId]);

	const fetchEventData = async () => {
		setIsLoading(true);
		try {
			// TODO: Replace with actual API call
			const mockEvent: EventInput = {
				id: eventId as string,
				eventName: 'Tech Conference 2024',
				eventDescription: 'Annual technology conference featuring the latest innovations and industry leaders.',
				eventCategories: ['TECHNOLOGY'],
				eventLocation: 'Convention Center, New York',
				eventStartDate: new Date('2024-06-15'),
				eventEndDate: new Date('2024-06-17'),
				eventPrice: 299,
				eventCapacity: 500,
				eventImage: '/images/events/tech-conference.jpg',
				organizerId: '1',
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			setEvent(mockEvent);
		} catch (error) {
			console.error('Failed to fetch event data:', error);
			setError('Failed to fetch event data');
		} finally {
			setIsLoading(false);
		}
	};

	const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPaymentInfo((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handlePurchase = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			// TODO: Replace with actual payment processing
			console.log('Processing payment with:', { ticketCount, paymentInfo });
			// Simulate payment processing
			await new Promise((resolve) => setTimeout(resolve, 2000));
			router.push(`/events/${eventId}/confirmation`); // Redirect to confirmation page
		} catch (error) {
			console.error('Payment failed:', error);
			setError('Payment failed. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <LoadingComponent />;
	}

	if (error) {
		return <ErrorComponent message={error} />;
	}

	if (!event) {
		return <ErrorComponent message="Event not found" />;
	}

	const totalPrice = event.eventPrice * ticketCount;

	return (
		<div className="min-h-screen bg-background py-12">
			<div className="max-w-4xl mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Event Details */}
					<Card className="bg-card">
						<CardHeader>
							<CardTitle className="text-card-foreground text-2xl font-semibold">{event.eventName}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center gap-2 text-card-foreground">
								<Calendar className="h-5 w-5" />
								<span>
									{event.eventStartDate.toLocaleDateString()} - {event.eventEndDate.toLocaleDateString()}
								</span>
							</div>
							<div className="flex items-center gap-2 text-card-foreground">
								<MapPin className="h-5 w-5" />
								<span>{event.eventLocation}</span>
							</div>
							<div className="flex items-center gap-2 text-card-foreground">
								<Clock className="h-5 w-5" />
								<span>3 days</span>
							</div>
							<Separator className="my-4" />
							<div className="space-y-2">
								<div className="flex justify-between text-card-foreground">
									<span>Ticket Price:</span>
									<span>${event.eventPrice}</span>
								</div>
								<div className="flex justify-between text-card-foreground">
									<span>Quantity:</span>
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
											className="text-card-foreground border-input"
										>
											-
										</Button>
										<span>{ticketCount}</span>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setTicketCount(ticketCount + 1)}
											className="text-card-foreground border-input"
										>
											+
										</Button>
									</div>
								</div>
								<Separator className="my-2" />
								<div className="flex justify-between text-card-foreground font-semibold">
									<span>Total:</span>
									<span>${totalPrice}</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Payment Form */}
					<Card className="bg-card">
						<CardHeader>
							<CardTitle className="text-card-foreground text-2xl font-semibold">Payment Information</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={handlePurchase} className="space-y-4">
								<div>
									<Label htmlFor="cardholderName" className="text-card-foreground">
										Cardholder Name
									</Label>
									<Input
										id="cardholderName"
										name="cardholderName"
										value={paymentInfo.cardholderName}
										onChange={handlePaymentInfoChange}
										required
										className="bg-background text-foreground border-input"
									/>
								</div>
								<div>
									<Label htmlFor="cardNumber" className="text-card-foreground">
										Card Number
									</Label>
									<Input
										id="cardNumber"
										name="cardNumber"
										value={paymentInfo.cardNumber}
										onChange={handlePaymentInfoChange}
										required
										placeholder="1234 5678 9012 3456"
										className="bg-background text-foreground border-input"
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="expiryDate" className="text-card-foreground">
											Expiry Date
										</Label>
										<Input
											id="expiryDate"
											name="expiryDate"
											value={paymentInfo.expiryDate}
											onChange={handlePaymentInfoChange}
											required
											placeholder="MM/YY"
											className="bg-background text-foreground border-input"
										/>
									</div>
									<div>
										<Label htmlFor="cvv" className="text-card-foreground">
											CVV
										</Label>
										<Input
											id="cvv"
											name="cvv"
											value={paymentInfo.cvv}
											onChange={handlePaymentInfoChange}
											required
											placeholder="123"
											className="bg-background text-foreground border-input"
										/>
									</div>
								</div>
								<Button
									type="submit"
									disabled={isLoading}
									className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
								>
									{isLoading ? (
										'Processing...'
									) : (
										<>
											<CreditCard className="mr-2 h-4 w-4" />
											Pay ${totalPrice}
										</>
									)}
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default TicketPurchasePage;
