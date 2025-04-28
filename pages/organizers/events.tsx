import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { EventInput, EventStatus, EventCategory } from '../../libs/types/event/event.input';

const OrganizerEventsPage = () => {
	const router = useRouter();
	const [events, setEvents] = useState<EventInput[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		// Check if user is an organizer
		const user = JSON.parse(localStorage.getItem('user') || '{}');
		if (user.memberType !== 'ORGANIZER') {
			router.push('/');
			return;
		}

		// Fetch organizer's events
		fetchEvents();
	}, []);

	const fetchEvents = async () => {
		setIsLoading(true);
		try {
			// TODO: Replace with actual API call
			const mockEvents: EventInput[] = [
				{
					eventName: 'Tech Conference 2024',
					eventDesc: 'Annual technology conference',
					eventImage: '/images/events/tech-conference.jpg',
					eventDate: new Date('2024-08-20'),
					eventStartTime: '09:00',
					eventEndTime: '17:00',
					eventAddress: 'San Francisco, CA',
					eventCapacity: 500,
					eventPrice: 299.99,
					eventStatus: EventStatus.UPCOMING,
					eventCategories: [EventCategory.TECHNOLOGY],
					groupId: '1',
				},
			];
			setEvents(mockEvents);
		} catch (err) {
			setError('Failed to fetch events');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (eventId: string) => {
		if (!confirm('Are you sure you want to delete this event?')) return;

		setIsLoading(true);
		try {
			// TODO: Replace with actual API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setEvents((prev) => prev.filter((event) => event.eventName !== eventId));
		} catch (err) {
			setError('Failed to delete event');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">My Events</h1>
					<button
						onClick={() => router.push('/organizer/events/create')}
						className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
					>
						Create Event
					</button>
				</div>

				{error && (
					<div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<p className="text-sm text-red-700">{error}</p>
							</div>
						</div>
					</div>
				)}

				{isLoading ? (
					<div className="flex justify-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{events.map((event) => (
							<div key={event.eventName} className="bg-white overflow-hidden shadow rounded-lg">
								<div className="relative h-48">
									<img
										src={event.eventImage}
										alt={event.eventName}
										className="absolute inset-0 w-full h-full object-cover"
									/>
								</div>
								<div className="px-4 py-5 sm:p-6">
									<h3 className="text-lg font-medium text-gray-900">{event.eventName}</h3>
									<p className="mt-1 text-sm text-gray-500">{event.eventDesc}</p>
									<div className="mt-4 flex items-center justify-between">
										<div className="flex items-center">
											<svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
											<span className="ml-2 text-sm text-gray-500">{event.eventDate.toLocaleDateString()}</span>
										</div>
										<span
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
												event.eventStatus === EventStatus.UPCOMING
													? 'bg-green-100 text-green-800'
													: 'bg-gray-100 text-gray-800'
											}`}
										>
											{event.eventStatus}
										</span>
									</div>
									<div className="mt-4 flex justify-end space-x-2">
										<button
											onClick={() => router.push(`/organizer/events/${event.eventName}/edit`)}
											className="text-indigo-600 hover:text-indigo-900"
										>
											Edit
										</button>
										<button onClick={() => handleDelete(event.eventName)} className="text-red-600 hover:text-red-900">
											Delete
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default OrganizerEventsPage;
