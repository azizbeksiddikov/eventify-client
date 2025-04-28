import Link from 'next/link';

interface Organizer {
	id: string;
	name: string;
	image: string;
	rating: number;
	eventsCount: number;
	category: string;
}

const TopOrganizers = () => {
	const organizers: Organizer[] = [
		{
			id: '1',
			name: 'Event Masters Inc.',
			image: '/images/organizers/event-masters.jpg',
			rating: 4.8,
			eventsCount: 156,
			category: 'Music & Entertainment',
		},
		{
			id: '2',
			name: 'Tech Conference Group',
			image: '/images/organizers/tech-group.jpg',
			rating: 4.9,
			eventsCount: 89,
			category: 'Technology',
		},
		{
			id: '3',
			name: 'Food & Wine Society',
			image: '/images/organizers/food-society.jpg',
			rating: 4.7,
			eventsCount: 112,
			category: 'Food & Beverage',
		},
		{
			id: '4',
			name: 'Sports Events Co.',
			image: '/images/organizers/sports-events.jpg',
			rating: 4.6,
			eventsCount: 78,
			category: 'Sports',
		},
	];

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-900">Top Organizers</h2>
				<Link href="/organizers" className="text-indigo-600 hover:text-indigo-800 font-medium">
					View All Organizers
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{organizers.map((organizer) => (
					<Link key={organizer.id} href={`/organizers/${organizer.id}`} className="block group">
						<div className="bg-white rounded-lg shadow overflow-hidden">
							<div className="relative pb-[56.25%]">
								<img
									src={organizer.image}
									alt={organizer.name}
									className="absolute inset-0 w-full h-full object-cover"
								/>
							</div>
							<div className="p-4">
								<h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">{organizer.name}</h3>
								<p className="text-sm text-gray-500 mb-2">{organizer.category}</p>
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										<span className="ml-1 text-sm text-gray-600">{organizer.rating}</span>
									</div>
									<span className="text-sm text-gray-500">{organizer.eventsCount} events</span>
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default TopOrganizers;
