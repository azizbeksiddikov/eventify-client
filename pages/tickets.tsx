import { useState } from 'react';
import Link from 'next/link';

interface Ticket {
	id: string;
	eventId: string;
	eventTitle: string;
	eventImage: string;
	eventDate: string;
	eventLocation: string;
	purchaseDate: string;
	quantity: number;
	totalPrice: number;
	status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
}

const MyTicketsPage = () => {
	const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('ALL');

	const tickets: Ticket[] = [
		{
			id: '1',
			eventId: '1',
			eventTitle: 'Summer Music Festival',
			eventImage: '/images/events/music-festival.jpg',
			eventDate: '2024-07-15',
			eventLocation: 'Central Park, New York',
			purchaseDate: '2024-03-20',
			quantity: 2,
			totalPrice: 199.98,
			status: 'UPCOMING',
		},
		{
			id: '2',
			eventId: '2',
			eventTitle: 'Tech Conference 2024',
			eventImage: '/images/events/tech-conference.jpg',
			eventDate: '2024-08-20',
			eventLocation: 'San Francisco, CA',
			purchaseDate: '2024-02-15',
			quantity: 1,
			totalPrice: 299.99,
			status: 'UPCOMING',
		},
		{
			id: '3',
			eventId: '3',
			eventTitle: 'Food & Wine Expo',
			eventImage: '/images/events/food-expo.jpg',
			eventDate: '2023-11-10',
			eventLocation: 'Chicago, IL',
			purchaseDate: '2023-09-01',
			quantity: 2,
			totalPrice: 299.98,
			status: 'COMPLETED',
		},
	];

	const filteredTickets = tickets.filter((ticket) => selectedStatus === 'ALL' || ticket.status === selectedStatus);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'UPCOMING':
				return 'bg-green-100 text-green-800';
			case 'COMPLETED':
				return 'bg-blue-100 text-blue-800';
			case 'CANCELLED':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
					<select
						value={selectedStatus}
						onChange={(e) => setSelectedStatus(e.target.value as 'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED')}
						className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
					>
						<option value="ALL">All Tickets</option>
						<option value="UPCOMING">Upcoming</option>
						<option value="COMPLETED">Completed</option>
						<option value="CANCELLED">Cancelled</option>
					</select>
				</div>

				<div className="space-y-6">
					{filteredTickets.map((ticket) => (
						<div key={ticket.id} className="bg-white rounded-lg shadow overflow-hidden">
							<div className="p-6">
								<div className="flex flex-col md:flex-row gap-6">
									<div className="relative w-full md:w-48 h-48 flex-shrink-0">
										<img
											src={ticket.eventImage}
											alt={ticket.eventTitle}
											className="absolute inset-0 w-full h-full object-cover rounded-lg"
										/>
									</div>
									<div className="flex-1">
										<div className="flex justify-between items-start">
											<div>
												<h3 className="text-lg font-semibold text-gray-900">{ticket.eventTitle}</h3>
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}
												>
													{ticket.status}
												</span>
											</div>
											<div className="text-right">
												<div className="text-lg font-bold text-indigo-600">${ticket.totalPrice}</div>
												<div className="text-sm text-gray-500">
													{ticket.quantity} ticket{ticket.quantity > 1 ? 's' : ''}
												</div>
											</div>
										</div>
										<div className="mt-4 space-y-2">
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
												{ticket.eventLocation}
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
												Event Date: {new Date(ticket.eventDate).toLocaleDateString()}
											</div>
											<div className="flex items-center text-sm text-gray-500">
												<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
												Purchased: {new Date(ticket.purchaseDate).toLocaleDateString()}
											</div>
										</div>
										<div className="mt-6 flex space-x-4">
											<Link
												href={`/events/${ticket.eventId}`}
												className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
											>
												View Event
											</Link>
											{ticket.status === 'UPCOMING' && (
												<button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
													Cancel Ticket
												</button>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default MyTicketsPage;
