import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { EventCard } from './EventCard';

interface Event {
	id: string;
	title: string;
	image: string;
	date: string;
	location: string;
	type: string;
	views: number;
}

interface Category {
	id: string;
	name: string;
	events: Event[];
	icon?: string;
}

const EventsByCategory = () => {
	const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());

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

	const categories: Category[] = [
		{
			id: '1',
			name: 'Music & Concerts',
			icon: '🎵',
			events: [
				{
					id: '1',
					title: 'Summer Music Festival',
					image: '/images/events/music-festival.jpg',
					date: '2024-07-15',
					location: 'Central Park, New York',
					type: 'festival',
					views: 1250,
				},
				{
					id: '2',
					title: 'Jazz Night',
					image: '/images/events/jazz-night.jpg',
					date: '2024-08-05',
					location: 'Blue Note, NYC',
					type: 'concert',
					views: 850,
				},
			],
		},
		{
			id: '2',
			name: 'Conferences',
			icon: '💡',
			events: [
				{
					id: '3',
					title: 'Tech Conference 2024',
					image: '/images/events/tech-conference.jpg',
					date: '2024-08-20',
					location: 'San Francisco, CA',
					type: 'conference',
					views: 2100,
				},
			],
		},
		{
			id: '3',
			name: 'Exhibitions',
			icon: '🎨',
			events: [
				{
					id: '4',
					title: 'Food & Wine Expo',
					image: '/images/events/food-expo.jpg',
					date: '2024-09-10',
					location: 'Chicago, IL',
					type: 'exhibition',
					views: 950,
				},
			],
		},
	];

	return (
		<section className="space-y-6 animate-fadeIn">
			<div className="flex items-center justify-between">
				<h2 className="text-h1 font-bold text-[#111111]">Events by Category</h2>
				<Link
					href="/events"
					className="text-[#E60023] hover:text-[#CC0000] transition-colors duration-200 flex items-center gap-1 text-body"
				>
					View All Categories
					<ArrowRight className="w-4 h-4" />
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{categories.map((category) => (
					<div
						key={category.id}
						className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 animate-slideIn flex flex-col"
					>
						<div className="p-4 border-b border-[#F5F5F5]">
							<div className="flex items-center gap-2">
								{category.icon && <span className="text-xl">{category.icon}</span>}
								<h3 className="text-lg font-semibold text-[#111111]">{category.name}</h3>
							</div>
						</div>
						<div className="p-4 flex-1">
							<div className="space-y-4">
								{category.events.map((event) => (
									<EventCard
										key={event.id}
										event={event}
										onLike={handleLikeEvent}
										isLiked={likedEvents.has(event.id)}
									/>
								))}
							</div>
						</div>
						<div className="p-4 border-t border-[#F5F5F5] mt-auto">
							<Link
								href={`/events?category=${category.id}`}
								className="text-sm text-[#E60023] hover:text-[#CC0000] font-medium flex items-center gap-1 transition-colors duration-200"
							>
								View all {category.name} events
								<ArrowRight className="w-3 h-3" />
							</Link>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default EventsByCategory;
