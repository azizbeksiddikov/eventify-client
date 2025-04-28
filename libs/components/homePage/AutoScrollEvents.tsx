import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Event {
	id: string;
	title: string;
	description: string;
	image: string;
	date: string;
	location: string;
	category: string;
}

const AutoScrollEvents = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isHovered, setIsHovered] = useState(false);
	const [hoverPosition, setHoverPosition] = useState<number | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [events] = useState<Event[]>([
		{
			id: '1',
			title: 'Summer Music Festival',
			description: 'Join us for the biggest music festival of the year!',
			image: '/images/events/music-festival.jpg',
			date: '2024-07-15',
			location: 'Central Park, New York',
			category: 'Music',
		},
		{
			id: '2',
			title: 'Tech Conference 2024',
			description: 'The future of technology and innovation',
			image: '/images/events/tech-conference.jpg',
			date: '2024-08-20',
			location: 'San Francisco, CA',
			category: 'Technology',
		},
		{
			id: '3',
			title: 'Food & Wine Expo',
			description: 'Experience the finest culinary delights',
			image: '/images/events/food-expo.jpg',
			date: '2024-09-10',
			location: 'Chicago, IL',
			category: 'Food & Drink',
		},
		{
			id: '4',
			title: 'Art Exhibition',
			description: 'Contemporary art from around the world',
			image: '/images/events/art-exhibition.jpg',
			date: '2024-10-05',
			location: 'Los Angeles, CA',
			category: 'Art',
		},
	]);

	useEffect(() => {
		if (isHovered) return;

		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
		}, 6000);

		return () => clearInterval(interval);
	}, [events.length, isHovered]);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!containerRef.current) return;

		const rect = containerRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const width = rect.width;
		const threshold = width * 0.2;

		if (x < threshold) {
			setHoverPosition(0); // Left edge
		} else if (x > width - threshold) {
			setHoverPosition(1); // Right edge
		} else {
			setHoverPosition(null);
		}
	};

	const handleNavigation = (direction: 'prev' | 'next') => {
		if (direction === 'prev') {
			setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
		} else {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
		}
	};

	return (
		<div
			ref={containerRef}
			className="relative h-[80vh] overflow-hidden"
			onMouseMove={handleMouseMove}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => {
				setIsHovered(false);
				setHoverPosition(null);
			}}
		>
			{events.map((event, index) => (
				<div
					key={event.id}
					className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
						index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
					}`}
				>
					<div
						className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-in-out"
						style={{ backgroundImage: `url(${event.image})` }}
					>
						{/* Gradient overlays for navigation */}
						{hoverPosition === 0 && (
							<div className="absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-[#111111]/80 to-transparent" />
						)}
						{hoverPosition === 1 && (
							<div className="absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-[#111111]/80 to-transparent" />
						)}
						<div className="absolute inset-0 bg-gradient-to-b from-[#111111]/70 via-[#111111]/40 to-[#111111]/70" />
					</div>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="text-center text-white max-w-4xl px-4 transform transition-all duration-1000 ease-in-out">
							<div className="mb-4 flex flex-wrap justify-center gap-2">
								{event.category.split(',').map((cat, index) => (
									<span
										key={index}
										className="inline-block bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 transition-colors duration-300"
									>
										#{cat.trim()}
									</span>
								))}
							</div>
							<h2 className="text-5xl font-bold mb-6">{event.title}</h2>
							<p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">{event.description}</p>
							<div className="flex justify-center space-x-6 mb-8">
								<span className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
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
								<span className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
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
								className="inline-block bg-[#E60023] text-white px-8 py-4 rounded-full font-medium hover:bg-[#CC0000] transition-colors duration-300"
							>
								View Details
							</Link>
						</div>
					</div>
				</div>
			))}
			{/* Thin Navigation Buttons */}
			<button
				onClick={() => handleNavigation('prev')}
				className="absolute inset-y-0 left-0 w-1/5 cursor-pointer group"
				aria-label="Previous event"
			>
				<div className="absolute inset-y-0 left-0 w-[2px] bg-white/20 group-hover:bg-white/40 transition-colors duration-300" />
			</button>
			<button
				onClick={() => handleNavigation('next')}
				className="absolute inset-y-0 right-0 w-1/5 cursor-pointer group"
				aria-label="Next event"
			>
				<div className="absolute inset-y-0 right-0 w-[2px] bg-white/20 group-hover:bg-white/40 transition-colors duration-300" />
			</button>
			<div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
				{events.map((_, index) => (
					<button
						key={index}
						className={`w-3 h-3 rounded-full transition-all duration-300 ${
							index === currentIndex ? 'bg-[#E60023] scale-125' : 'bg-white/50 hover:bg-white/75'
						}`}
						onClick={() => setCurrentIndex(index)}
					/>
				))}
			</div>
		</div>
	);
};

export default AutoScrollEvents;
