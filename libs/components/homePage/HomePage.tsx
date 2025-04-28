import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { EventInput, EventStatus, EventCategory } from '@/libs/types/event/event.input';
import { GroupInput } from '@/libs/types/group/group.input';
import { GroupCategory } from '@/libs/enums/group.enum';
import Image from 'next/image';
import { Button } from '@/libs/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { ChevronLeft, ChevronRight, Heart, Users, Calendar, MapPin, Clock } from 'lucide-react';

const HomePage = () => {
	const router = useRouter();
	const [events, setEvents] = useState<EventInput[]>([]);
	const [groups, setGroups] = useState<GroupInput[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [currentEventIndex, setCurrentEventIndex] = useState(0);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
	const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());
	const [likedGroups, setLikedGroups] = useState<Set<string>>(new Set());
	const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		setIsLoading(true);
		try {
			// TODO: Replace with actual API calls
			const mockEvents: EventInput[] = [
				{
					id: '1',
					eventName: 'Tech Conference 2024',
					eventDesc: 'Join us for the biggest technology conference of the year!',
					eventImage: '/images/events/tech-conference.jpg',
					eventDate: new Date('2024-08-20'),
					eventStartTime: '09:00',
					eventEndTime: '17:00',
					eventAddress: 'San Francisco Convention Center',
					eventCapacity: 500,
					eventPrice: 299.99,
					eventStatus: EventStatus.UPCOMING,
					eventCategories: [EventCategory.TECHNOLOGY],
					groupId: '1',
					organizerId: '1',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: '2',
					eventName: 'Food & Wine Festival',
					eventDesc: 'Experience the finest culinary delights and premium wines.',
					eventImage: '/images/events/food-festival.jpg',
					eventDate: new Date('2024-09-15'),
					eventStartTime: '11:00',
					eventEndTime: '20:00',
					eventAddress: 'Central Park, New York',
					eventCapacity: 1000,
					eventPrice: 149.99,
					eventStatus: EventStatus.UPCOMING,
					eventCategories: [EventCategory.FOOD],
					groupId: '2',
					organizerId: '2',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: '3',
					eventName: 'Art Exhibition: Modern Masters',
					eventDesc: 'A curated collection of contemporary art from emerging and established artists.',
					eventImage: '/images/events/art-exhibition.jpg',
					eventDate: new Date('2024-07-10'),
					eventStartTime: '10:00',
					eventEndTime: '18:00',
					eventAddress: 'Modern Art Museum, Chicago',
					eventCapacity: 200,
					eventPrice: 25.0,
					eventStatus: EventStatus.UPCOMING,
					eventCategories: [EventCategory.ART],
					groupId: '3',
					organizerId: '3',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: '4',
					eventName: 'Summer Music Festival',
					eventDesc: 'Three days of live music featuring top artists from around the world.',
					eventImage: '/images/events/music-festival.jpg',
					eventDate: new Date('2024-08-05'),
					eventStartTime: '14:00',
					eventEndTime: '23:00',
					eventAddress: 'Golden Gate Park, San Francisco',
					eventCapacity: 5000,
					eventPrice: 199.99,
					eventStatus: EventStatus.UPCOMING,
					eventCategories: [EventCategory.MUSIC],
					groupId: '4',
					organizerId: '4',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			const mockGroups: GroupInput[] = [
				{
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
				},
				{
					id: '2',
					name: 'Food Lovers',
					description: 'Join us to explore the world of culinary arts and gastronomy.',
					image: '/images/groups/food-lovers.jpg',
					category: GroupCategory.FOOD as GroupCategory,
					organizerId: '2',
					membersCount: 800,
					eventsCount: 15,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			setEvents(mockEvents);
			setGroups(mockGroups);
		} catch (error) {
			console.error('Failed to fetch data:', error);
			setError('Failed to fetch data');
		} finally {
			setIsLoading(false);
		}
	};

	const handlePrevEvent = () => {
		setCurrentEventIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
	};

	const handleNextEvent = () => {
		setCurrentEventIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
	};

	const getEventsForSelectedDate = () => {
		if (!selectedDate) return [];
		return events.filter(
			(event) =>
				event.eventDate.getDate() === selectedDate.getDate() &&
				event.eventDate.getMonth() === selectedDate.getMonth() &&
				event.eventDate.getFullYear() === selectedDate.getFullYear()
		);
	};

	const handleLikeEvent = (eventId: string) => {
		setLikedEvents((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(eventId)) {
				newSet.delete(eventId);
			} else {
				newSet.add(eventId);
			}
			return newSet;
		});
	};

	const handleLikeGroup = (groupId: string) => {
		setLikedGroups((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(groupId)) {
				newSet.delete(groupId);
			} else {
				newSet.add(groupId);
			}
			return newSet;
		});
	};

	const handleJoinGroup = (groupId: string) => {
		setJoinedGroups((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(groupId)) {
				newSet.delete(groupId);
			} else {
				newSet.add(groupId);
			}
			return newSet;
		});
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Featured Events Section */}
			<div className="relative h-[600px] overflow-hidden">
				{events.length > 0 && (
					<>
						<div className="absolute inset-0 transition-opacity duration-500">
							<Image
								src={events[currentEventIndex].eventImage}
								alt={events[currentEventIndex].eventName}
								fill
								className="object-cover"
								priority
							/>
							<div className="absolute inset-0 bg-black bg-opacity-50" />
						</div>
						<div className="relative h-full flex items-center justify-center">
							<div className="max-w-4xl mx-auto px-4 text-center text-white">
								<h1 className="text-4xl md:text-6xl font-bold mb-4">
									{events[currentEventIndex].eventName}
								</h1>
								<p className="text-xl mb-8">{events[currentEventIndex].eventDesc}</p>
								<div className="flex items-center justify-center gap-4">
									<Button
										size="lg"
										onClick={() => router.push(`/events/${events[currentEventIndex].id}`)}
										className="bg-white text-black hover:bg-gray-100"
									>
										View Event
									</Button>
									<Button
										variant="ghost"
										size="lg"
										onClick={() => handleLikeEvent(events[currentEventIndex].id)}
										className="text-white hover:bg-white/10"
									>
										<Heart
											className={`h-6 w-6 ${
												likedEvents.has(events[currentEventIndex].id)
													? 'fill-red-500 text-red-500'
													: ''
											}`}
										/>
									</Button>
								</div>
							</div>
						</div>
						<button
							onClick={handlePrevEvent}
							className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all duration-300"
						>
							<ChevronLeft className="h-8 w-8 text-white" />
						</button>
						<button
							onClick={handleNextEvent}
							className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all duration-300"
						>
							<ChevronRight className="h-8 w-8 text-white" />
						</button>
					</>
				)}
			</div>

			{/* Calendar Section */}
			<div className="max-w-7xl mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div>
						<Card>
							<CardHeader>
								<CardTitle>Event Calendar</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="border rounded-md p-4">
									<input
										type="date"
										value={selectedDate?.toISOString().split('T')[0]}
										onChange={(e) => setSelectedDate(new Date(e.target.value))}
										className="w-full p-2 border rounded"
									/>
								</div>
							</CardContent>
						</Card>
					</div>
					<div>
						<Card>
							<CardHeader>
								<CardTitle>
									Events on {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
								</CardTitle>
							</CardHeader>
							<CardContent>
								{getEventsForSelectedDate().length > 0 ? (
									<div className="space-y-4">
										{getEventsForSelectedDate().map((event) => (
											<div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
												<div className="flex justify-between items-start">
													<div>
														<h3 className="font-semibold">{event.eventName}</h3>
														<p className="text-sm text-gray-600">{event.eventDesc}</p>
													</div>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleLikeEvent(event.id)}
														className="text-gray-500 hover:text-red-500"
													>
														<Heart
															className={`h-5 w-5 ${
																likedEvents.has(event.id) ? 'fill-red-500 text-red-500' : ''
															}`}
														/>
													</Button>
												</div>
												<div className="mt-2 flex items-center justify-between">
													<span className="text-sm text-gray-500">
														{event.eventStartTime} - {event.eventEndTime}
													</span>
													<Button
														variant="outline"
														size="sm"
														onClick={() => router.push(`/events/${event.id}`)}
													>
														View Details
													</Button>
												</div>
											</div>
										))}
									</div>
								) : (
									<p className="text-gray-500">No events scheduled for this date.</p>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* Popular Groups Section */}
			<div className="max-w-7xl mx-auto px-4 py-12">
				<h2 className="text-3xl font-bold mb-8">Popular Groups</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{groups.map((group) => (
						<Card key={group.id} className="hover:shadow-lg transition-shadow">
							<div className="relative h-48">
								<Image
									src={group.image}
									alt={group.name}
									fill
									className="object-cover rounded-t-lg"
								/>
								<div className="absolute top-2 right-2 flex gap-2">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleLikeGroup(group.id)}
										className="bg-white/80 hover:bg-white text-gray-500 hover:text-red-500"
									>
										<Heart
											className={`h-5 w-5 ${
												likedGroups.has(group.id) ? 'fill-red-500 text-red-500' : ''
											}`}
										/>
									</Button>
								</div>
							</div>
							<CardHeader>
								<CardTitle>{group.name}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600 mb-4">{group.description}</p>
								<div className="flex justify-between items-center">
									<div className="text-sm text-gray-500">
										<Users className="inline-block mr-1 h-4 w-4" />
										{group.membersCount} members • {group.eventsCount} events
									</div>
									<Button
										variant={joinedGroups.has(group.id) ? "default" : "outline"}
										onClick={() => handleJoinGroup(group.id)}
										className={joinedGroups.has(group.id) ? "bg-green-600 hover:bg-green-700" : ""}
									>
										{joinedGroups.has(group.id) ? "Joined" : "Join Group"}
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
 