import { useState } from 'react';
import Link from 'next/link';
import { EventCategory } from '../libs/enums/event.enum';

interface Event {
	id: string;
	title: string;
	description: string;
	image: string;
	date: string;
	location: string;
	category: EventCategory;
	price: number;
	availableTickets: number;
	createdAt: string;
	updatedAt: string;
	eventLikes: number;
	eventViews: number;
	attendeeCount: number;
}

const availableEventsSorts = ['createdAt', 'updatedAt', 'eventLikes', 'eventViews', 'attendeeCount'] as const;
type EventSort = (typeof availableEventsSorts)[number];

const EventsPage = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'ALL'>('ALL');
	const [dateRange, setDateRange] = useState({
		startDate: '',
		endDate: '',
	});
	const [sortBy, setSortBy] = useState<EventSort>('createdAt');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 6;

	const events: Event[] = [
		{
			id: '1',
			title: 'Summer Music Festival',
			description: 'Join us for the biggest music festival of the year featuring top artists from around the world',
			image: '/images/events/music-festival.jpg',
			date: '2024-07-15',
			location: 'Central Park, New York',
			category: EventCategory.ENTERTAINMENT,
			price: 99.99,
			availableTickets: 500,
			createdAt: '2024-01-15',
			updatedAt: '2024-03-20',
			eventLikes: 1200,
			eventViews: 5000,
			attendeeCount: 3000,
		},
		{
			id: '2',
			title: 'Tech Conference 2024',
			description: 'The future of technology and innovation with industry leaders and experts',
			image: '/images/events/tech-conference.jpg',
			date: '2024-08-20',
			location: 'San Francisco, CA',
			category: EventCategory.TECHNOLOGY,
			price: 299.99,
			availableTickets: 200,
			createdAt: '2024-02-10',
			updatedAt: '2024-04-15',
			eventLikes: 800,
			eventViews: 3000,
			attendeeCount: 1500,
		},
		{
			id: '3',
			title: 'Food & Wine Expo',
			description: 'Experience the finest culinary delights and wine tasting from renowned chefs',
			image: '/images/events/food-expo.jpg',
			date: '2024-09-10',
			location: 'Chicago, IL',
			category: EventCategory.FOOD,
			price: 149.99,
			availableTickets: 300,
		},
		{
			id: '4',
			title: 'Art Exhibition',
			description: 'Contemporary art from around the world in a stunning gallery setting',
			image: '/images/events/art-exhibition.jpg',
			date: '2024-10-05',
			location: 'Los Angeles, CA',
			category: EventCategory.ART,
			price: 49.99,
			availableTickets: 150,
		},
	];

	const categories = ['ALL', ...Object.values(EventCategory)];

	const filteredEvents = events.filter((event) => {
		const matchesSearch =
			event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = selectedCategory === 'ALL' || event.category === selectedCategory;
		const matchesDate =
			(!dateRange.startDate || event.date >= dateRange.startDate) &&
			(!dateRange.endDate || event.date <= dateRange.endDate);
		return matchesSearch && matchesCategory && matchesDate;
	});

	const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Events</h1>
					<Link
						href="/events/create"
						className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
					>
						Create Event
					</Link>
				</div>

				{/* Search and Filter Section */}
				<div className="bg-white rounded-lg shadow p-6 mb-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div>
							<label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
								Search Events
							</label>
							<input
								type="text"
								id="search"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Search by title or description"
								className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							/>
						</div>
						<div>
							<label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
								Filter by Category
							</label>
							<select
								id="category"
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value as EventCategory | 'ALL')}
								className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							>
								{categories.map((category) => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
							</select>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
									Start Date
								</label>
								<input
									type="date"
									id="startDate"
									value={dateRange.startDate}
									onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
									className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							</div>
							<div>
								<label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
									End Date
								</label>
								<input
									type="date"
									id="endDate"
									value={dateRange.endDate}
									onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
									className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Events Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{currentEvents.map((event) => (
						<Link key={event.id} href={`/events/${event.id}`} className="block">
							<div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
								<div className="relative h-48">
									<img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
								</div>
								<div className="p-6">
									<div className="flex justify-between items-start mb-2">
										<h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
										<span className="text-lg font-bold text-indigo-600">${event.price}</span>
									</div>
									<p className="text-gray-500 text-sm mb-4 line-clamp-2">{event.description}</p>
									<div className="space-y-2">
										<div className="flex items-center text-sm text-gray-500">
											<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
												/>
											</svg>
											{event.location}
										</div>
										<div className="flex items-center text-sm text-gray-500">
											<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
												/>
											</svg>
											{new Date(event.date).toLocaleDateString()}
										</div>
										<div className="flex items-center text-sm text-gray-500">
											<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
												/>
											</svg>
											{event.availableTickets} tickets left
										</div>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="mt-8 flex justify-center">
						<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
							<button
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Previous
							</button>
							{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
								<button
									key={page}
									onClick={() => handlePageChange(page)}
									className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
										currentPage === page
											? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
											: 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
									}`}
								>
									{page}
								</button>
							))}
							<button
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Next
							</button>
						</nav>
					</div>
				)}
			</div>
		</div>
	);
};

export default EventsPage;
 