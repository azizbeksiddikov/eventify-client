import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
	id: string;
	title: string;
	description: string;
	image: string;
	date: string;
	location: string;
}

const AutoScrollEvents = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [events, setEvents] = useState<Event[]>([
		{
			id: '1',
			title: 'Summer Music Festival',
			description: 'Join us for the biggest music festival of the year!',
			image: '/images/events/music-festival.jpg',
			date: '2024-07-15',
			location: 'Central Park, New York',
		},
		{
			id: '2',
			title: 'Tech Conference 2024',
			description: 'The future of technology and innovation',
			image: '/images/events/tech-conference.jpg',
			date: '2024-08-20',
			location: 'San Francisco, CA',
		},
		{
			id: '3',
			title: 'Food & Wine Expo',
			description: 'Experience the finest culinary delights',
			image: '/images/events/food-expo.jpg',
			date: '2024-09-10',
			location: 'Chicago, IL',
		},
		{
			id: '4',
			title: 'Art Exhibition',
			description: 'Contemporary art from around the world',
			image: '/images/events/art-exhibition.jpg',
			date: '2024-10-05',
			location: 'Los Angeles, CA',
		},
	]);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
		}, 6000);

		return () => clearInterval(interval);
	}, [events.length]);

	return (
		<div className="relative h-[600px] overflow-hidden">
			{events.map((event, index) => (
				<div
					key={event.id}
					className={`absolute inset-0 transition-opacity duration-1000 ${
						index === currentIndex ? 'opacity-100' : 'opacity-0'
					}`}
				>
					<div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${event.image})` }}>
						<div className="absolute inset-0 bg-black bg-opacity-50" />
					</div>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="text-center text-white max-w-3xl px-4">
							<h2 className="text-4xl font-bold mb-4">{event.title}</h2>
							<p className="text-xl mb-6">{event.description}</p>
							<div className="flex justify-center space-x-4 mb-8">
								<span className="flex items-center">
									<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
								</span>
								<span className="flex items-center">
									<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									{new Date(event.date).toLocaleDateString()}
								</span>
							</div>
							<Link
								href={`/events/${event.id}`}
								className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
							>
								View Details
							</Link>
						</div>
					</div>
				</div>
			))}
			<div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
				{events.map((_, index) => (
					<button
						key={index}
						className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
						onClick={() => setCurrentIndex(index)}
					/>
				))}
			</div>
		</div>
	);
};

export default AutoScrollEvents;
