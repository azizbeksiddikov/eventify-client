import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { EventInput, EventStatus, EventCategory } from '@/libs/types/event/event.input';
import { OrganizerInput, MemberType } from '@/libs/types/member/member.input';
import { GroupInput } from '@/libs/types/group/group.input';
import { GroupCategory } from '@/libs/enums/group.enum';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Badge } from '@/libs/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { Separator } from '@/libs/components/ui/separator';
import { Skeleton } from '@/libs/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/libs/components/ui/alert';
import { Calendar, Clock, MapPin, Users, Globe, Twitter, Linkedin } from 'lucide-react';

const EventDetailPage = () => {
	const router = useRouter();
	const { eventId } = router.query;
	const [event, setEvent] = useState<EventInput | null>(null);
	const [organizer, setOrganizer] = useState<OrganizerInput | null>(null);
	const [group, setGroup] = useState<GroupInput | null>(null);
	const [similarEvents, setSimilarEvents] = useState<EventInput[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [ticketCount, setTicketCount] = useState(1);

	useEffect(() => {
		if (eventId) {
			fetchEventDetails();
		}
	}, [eventId]);

	const fetchEventDetails = async () => {
		setIsLoading(true);
		try {
			// TODO: Replace with actual API calls
			const mockEvents: Record<string, EventInput> = {
				'1': {
					id: '1',
					eventName: 'Tech Conference 2024',
					eventDesc:
						'Join us for the biggest technology conference of the year! This event brings together industry leaders, innovators, and tech enthusiasts for three days of learning, networking, and inspiration. Featuring keynote speakers, workshops, and panel discussions on the latest trends in technology.',
					eventImage: '/images/events/tech-conference.jpg',
					eventDate: new Date('2024-08-20'),
					eventStartTime: '09:00',
					eventEndTime: '17:00',
					eventAddress: 'San Francisco Convention Center, 747 Howard St, San Francisco, CA 94103',
					eventCapacity: 500,
					eventPrice: 299.99,
					eventStatus: EventStatus.UPCOMING,
					eventCategories: [EventCategory.TECHNOLOGY],
					groupId: '1',
					organizerId: '1',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				'2': {
					id: '2',
					eventName: 'Food & Wine Festival',
					eventDesc:
						'Experience the finest culinary delights and premium wines from around the world. Join us for a weekend of gastronomic exploration, cooking demonstrations, and wine tastings.',
					eventImage: '/images/events/food-festival.jpg',
					eventDate: new Date('2024-09-15'),
					eventStartTime: '11:00',
					eventEndTime: '20:00',
					eventAddress: 'Central Park, New York, NY',
					eventCapacity: 1000,
					eventPrice: 149.99,
					eventStatus: EventStatus.UPCOMING,
					eventCategories: [EventCategory.FOOD],
					groupId: '2',
					organizerId: '2',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				'3': {
					id: '3',
					eventName: 'Art Exhibition: Modern Masters',
					eventDesc:
						'A curated collection of contemporary art from emerging and established artists. This exhibition showcases various mediums including painting, sculpture, and digital art.',
					eventImage: '/images/events/art-exhibition.jpg',
					eventDate: new Date('2024-07-10'),
					eventStartTime: '10:00',
					eventEndTime: '18:00',
					eventAddress: 'Modern Art Museum, 123 Art Street, Chicago, IL',
					eventCapacity: 200,
					eventPrice: 25.0,
					eventStatus: EventStatus.UPCOMING,
					eventCategories: [EventCategory.ART],
					groupId: '3',
					organizerId: '3',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			};

			const mockOrganizers: Record<string, OrganizerInput> = {
				'1': {
					id: '1',
					email: 'john@techconf.com',
					firstName: 'John',
					lastName: 'Smith',
					phoneNumber: '+1 234 567 8900',
					memberType: MemberType.ORGANIZER,
					profileImage: '/images/organizers/john-smith.jpg',
					bio: 'Tech enthusiast and conference organizer with 10+ years of experience in the industry.',
					website: 'https://techconf.com',
					socialMedia: {
						twitter: '@johnsmith',
						linkedin: 'johnsmith',
					},
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			};

			const mockGroups: Record<string, GroupInput> = {
				'1': {
					id: '1',
					name: 'Tech Innovators',
					description: 'A community of technology enthusiasts and professionals.',
					image: '/images/groups/tech-innovators.jpg',
					category: GroupCategory.TECHNOLOGY as GroupCategory,
					organizerId: '1',
					membersCount: 1500,
					eventsCount: 25,
					createdAt: new Date(),
					updatedAt: new Date(),
					socialMedia: {
						twitter: '@techinnovators',
						linkedin: 'tech-innovators',
					},
				},
			};

			const selectedEvent = mockEvents[eventId as string];
			if (!selectedEvent) {
				throw new Error('Event not found');
			}

			setEvent(selectedEvent);
			setOrganizer(mockOrganizers[selectedEvent.organizerId]);
			setGroup(mockGroups[selectedEvent.groupId]);
			setSimilarEvents(
				Object.values(mockEvents).filter(
					(e) =>
						e.id !== selectedEvent.id && e.eventCategories.some((cat) => selectedEvent.eventCategories.includes(cat)),
				),
			);
		} catch (error) {
			console.error('Failed to fetch event details:', error);
			setError('Failed to fetch event details');
		} finally {
			setIsLoading(false);
		}
	};

	const handleTicketCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value);
		if (value > 0 && value <= (event?.eventCapacity || 1)) {
			setTicketCount(value);
		}
	};

	const handlePurchase = () => {
		router.push(`/checkout?eventId=${eventId}&tickets=${ticketCount}`);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 py-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<Card>
						<Skeleton className="h-96 w-full" />
						<CardContent className="space-y-4 p-6">
							<Skeleton className="h-8 w-3/4" />
							<Skeleton className="h-4 w-1/2" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (error || !event) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Alert variant="destructive" className="max-w-md">
					<AlertTitle>Event Not Found</AlertTitle>
					<AlertDescription>The event you&apos;re looking for doesn&apos;t exist or has been removed.</AlertDescription>
					<Button variant="outline" onClick={() => router.push('/events')} className="mt-4">
						Back to Events
					</Button>
				</Alert>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<Card>
							<div className="relative h-96 w-full">
								<Image
									src={event.eventImage}
									alt={event.eventName}
									fill
									className="object-cover rounded-t-lg"
									priority
								/>
							</div>
							<CardHeader>
								<div className="flex justify-between items-start">
									<div>
										<CardTitle className="text-3xl">{event.eventName}</CardTitle>
										<div className="mt-2 flex items-center space-x-2">
											<Badge variant="secondary">{event.eventStatus}</Badge>
											{event.eventCategories.map((category) => (
												<Badge key={category} variant="outline">
													{category}
												</Badge>
											))}
										</div>
									</div>
									<div className="text-right">
										<div className="text-2xl font-bold">${event.eventPrice}</div>
										<div className="text-sm text-gray-500">per ticket</div>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
									<div className="space-y-4">
										<div className="flex items-center space-x-2">
											<Calendar className="h-5 w-5 text-gray-500" />
											<span>
												{event.eventDate.toLocaleDateString('en-US', {
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric',
												})}
											</span>
										</div>
										<div className="flex items-center space-x-2">
											<Clock className="h-5 w-5 text-gray-500" />
											<span>
												{event.eventStartTime} - {event.eventEndTime}
											</span>
										</div>
										<div className="flex items-center space-x-2">
											<MapPin className="h-5 w-5 text-gray-500" />
											<span>{event.eventAddress}</span>
										</div>
										<div className="flex items-center space-x-2">
											<Users className="h-5 w-5 text-gray-500" />
											<span>{event.eventCapacity} capacity</span>
										</div>
									</div>
									<div className="space-y-4">
										<div>
											<h3 className="text-lg font-semibold mb-2">Description</h3>
											<p className="text-gray-600 whitespace-pre-line">{event.eventDesc}</p>
										</div>
									</div>
								</div>
								<Separator className="my-6" />
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<label htmlFor="ticketCount" className="text-sm font-medium">
											Tickets:
										</label>
										<Input
											type="number"
											id="ticketCount"
											min="1"
											max={event.eventCapacity}
											value={ticketCount}
											onChange={handleTicketCountChange}
											className="w-20"
										/>
									</div>
									<Button onClick={handlePurchase} size="lg">
										Purchase Tickets
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="space-y-6">
						{organizer && (
							<Card>
								<CardHeader>
									<CardTitle>Organizer</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex items-center space-x-4">
										<div className="relative h-16 w-16 rounded-full overflow-hidden">
											<Image
												src={organizer.profileImage || '/images/default-avatar.jpg'}
												alt={`${organizer.firstName} ${organizer.lastName}`}
												fill
												className="object-cover"
											/>
										</div>
										<div>
											<h3 className="font-semibold">
												{organizer.firstName} {organizer.lastName}
											</h3>
											<p className="text-sm text-gray-500">{organizer.bio}</p>
											<div className="flex space-x-2 mt-2">
												{organizer.socialMedia?.twitter && (
													<a
														href={`https://twitter.com/${organizer.socialMedia.twitter}`}
														target="_blank"
														rel="noopener noreferrer"
													>
														<Twitter className="h-4 w-4 text-gray-500 hover:text-gray-700" />
													</a>
												)}
												{organizer.socialMedia?.linkedin && (
													<a
														href={`https://linkedin.com/in/${organizer.socialMedia.linkedin}`}
														target="_blank"
														rel="noopener noreferrer"
													>
														<Linkedin className="h-4 w-4 text-gray-500 hover:text-gray-700" />
													</a>
												)}
												{organizer.website && (
													<a href={organizer.website} target="_blank" rel="noopener noreferrer">
														<Globe className="h-4 w-4 text-gray-500 hover:text-gray-700" />
													</a>
												)}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						)}

						{group && (
							<Card>
								<CardHeader>
									<CardTitle>Hosting Group</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex items-center space-x-4">
										<div className="relative h-16 w-16 rounded-lg overflow-hidden">
											<Image src={group.image} alt={group.name} fill className="object-cover" />
										</div>
										<div>
											<Link href={`/groups/${group.id}`}>
												<h3 className="font-semibold hover:text-indigo-600">{group.name}</h3>
											</Link>
											<p className="text-sm text-gray-500">{group.description}</p>
											<div className="flex items-center space-x-4 mt-2">
												<span className="text-sm text-gray-500">{group.membersCount} members</span>
												<span className="text-sm text-gray-500">{group.eventsCount} events</span>
											</div>
											<div className="flex space-x-2 mt-2">
												{group.socialMedia?.twitter && (
													<a
														href={`https://twitter.com/${group.socialMedia.twitter}`}
														target="_blank"
														rel="noopener noreferrer"
													>
														<Twitter className="h-4 w-4 text-gray-500 hover:text-gray-700" />
													</a>
												)}
												{group.socialMedia?.linkedin && (
													<a
														href={`https://linkedin.com/company/${group.socialMedia.linkedin}`}
														target="_blank"
														rel="noopener noreferrer"
													>
														<Linkedin className="h-4 w-4 text-gray-500 hover:text-gray-700" />
													</a>
												)}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						)}

						{similarEvents.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle>Similar Events</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{similarEvents.map((similarEvent) => (
											<Link key={similarEvent.id} href={`/events/${similarEvent.id}`}>
												<div className="flex space-x-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
													<div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
														<Image
															src={similarEvent.eventImage}
															alt={similarEvent.eventName}
															fill
															className="object-cover"
														/>
													</div>
													<div>
														<h4 className="font-medium hover:text-indigo-600">{similarEvent.eventName}</h4>
														<p className="text-sm text-gray-500">{similarEvent.eventDate.toLocaleDateString()}</p>
														<div className="flex space-x-2 mt-1">
															{similarEvent.eventCategories.map((category) => (
																<Badge key={category} variant="outline" className="text-xs">
																	{category}
																</Badge>
															))}
														</div>
													</div>
												</div>
											</Link>
										))}
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventDetailPage;
 