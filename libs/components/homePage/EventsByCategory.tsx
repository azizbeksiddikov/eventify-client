import Link from 'next/link';

interface Event {
	id: string;
	title: string;
	image: string;
	date: string;
	location: string;
	type: string;
}

interface Category {
	id: string;
	name: string;
	events: Event[];
}

const EventsByCategory = () => {
	const categories: Category[] = [
		{
			id: '1',
			name: 'Music & Concerts',
			events: [
				{
					id: '1',
					title: 'Summer Music Festival',
					image: '/images/events/music-festival.jpg',
					date: '2024-07-15',
					location: 'Central Park, New York',
					type: 'festival',
				},
				{
					id: '2',
					title: 'Jazz Night',
					image: '/images/events/jazz-night.jpg',
					date: '2024-08-05',
					location: 'Blue Note, NYC',
					type: 'concert',
				},
			],
		},
		{
			id: '2',
			name: 'Conferences',
			events: [
				{
					id: '3',
					title: 'Tech Conference 2024',
					image: '/images/events/tech-conference.jpg',
					date: '2024-08-20',
					location: 'San Francisco, CA',
					type: 'conference',
				},
			],
		},
		{
			id: '3',
			name: 'Exhibitions',
			events: [
				{
					id: '4',
					title: 'Food & Wine Expo',
					image: '/images/events/food-expo.jpg',
					date: '2024-09-10',
					location: 'Chicago, IL',
					type: 'exhibition',
				},
			],
		},
	];

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-900">Events by Category</h2>
				<Link href="/events" className="text-indigo-600 hover:text-indigo-800 font-medium">
					View All Categories
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{categories.map((category) => (
					<div key={category.id} className="bg-white rounded-lg shadow overflow-hidden">
						<div className="p-4 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
						</div>
						<div className="p-4">
							<div className="space-y-4">
								{category.events.map((event) => (
									<Link key={event.id} href={`/events/${event.id}`} className="block group">
										<div className="flex items-start space-x-4">
											<div className="flex-shrink-0">
												<div className="w-16 h-16 rounded-lg overflow-hidden">
													<img src={event.image} alt={event.title} className="w-full h-full object-cover" />
												</div>
											</div>
											<div className="flex-1 min-w-0">
												<h4 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 truncate">
													{event.title}
												</h4>
												<p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
												<p className="text-sm text-gray-500 truncate">{event.location}</p>
											</div>
										</div>
									</Link>
								))}
							</div>
							<div className="mt-4">
								<Link
									href={`/events?category=${category.id}`}
									className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
								>
									View all {category.name} events →
								</Link>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default EventsByCategory;
