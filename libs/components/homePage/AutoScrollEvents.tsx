import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';

import { Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/libs/utils';
import { EventsInquiry } from '@/libs/types/event/event.input';
import { GET_EVENTS } from '@/apollo/user/query';
import { Direction } from '@/libs/enums/common.enum';
import { EventStatus } from '@/libs/enums/event.enum';
import { Event } from '@/libs/types/event/event';

interface AutoScrollEventsProps {
	initialInput?: EventsInquiry;
}

const AutoScrollEvents = ({
	initialInput = {
		page: 1,
		limit: 8,
		sort: 'eventViews',
		direction: Direction.DESC,
		search: { eventStatus: EventStatus.UPCOMING },
	},
}: AutoScrollEventsProps) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [hoverPosition, setHoverPosition] = useState<number | null>(null);
	const [isAutoScrolling, setIsAutoScrolling] = useState(true);
	const containerRef = useRef<HTMLDivElement>(null);
	const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const lastInteractionTimeRef = useRef<number>(Date.now());

	const { data: upcomingEvents, loading: upcomingEventsLoading } = useQuery(GET_EVENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
	});

	const eventList: Event[] = upcomingEvents?.getEvents?.list || [];

	// Handle keyboard navigation with proper dependencies
	const handleNavigation = useCallback(
		(direction: 'prev' | 'next') => {
			setIsAutoScrolling(false);
			lastInteractionTimeRef.current = Date.now();

			if (autoScrollIntervalRef.current) {
				clearInterval(autoScrollIntervalRef.current);
				autoScrollIntervalRef.current = null;
			}

			setCurrentIndex((prevIndex) => {
				if (direction === 'prev') {
					return (prevIndex - 1 + eventList.length) % eventList.length;
				}
				return (prevIndex + 1) % eventList.length;
			});

			// Restart auto-scroll after a delay of inactivity
			setTimeout(() => {
				if (!autoScrollIntervalRef.current && isAutoScrolling) {
					autoScrollIntervalRef.current = setInterval(() => {
						setCurrentIndex((prevIndex) => (prevIndex + 1) % eventList.length);
					}, 4000);
				}
			}, 7000);
		},
		[eventList.length, isAutoScrolling],
	);

	// Handle keyboard navigation
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') {
				handleNavigation('prev');
			} else if (e.key === 'ArrowRight') {
				handleNavigation('next');
			}
		},
		[handleNavigation],
	);

	// Setup and cleanup keyboard event listeners
	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleKeyDown]);

	// Auto-scroll functionality
	useEffect(() => {
		if (!eventList.length || !isAutoScrolling) return;

		autoScrollIntervalRef.current = setInterval(() => {
			// Check if there was recent user interaction
			if (Date.now() - lastInteractionTimeRef.current > 5000) {
				setCurrentIndex((prevIndex) => (prevIndex + 1) % eventList.length);
			}
		}, 5000);

		return () => {
			if (autoScrollIntervalRef.current) {
				clearInterval(autoScrollIntervalRef.current);
				autoScrollIntervalRef.current = null;
			}
		};
	}, [eventList.length, isAutoScrolling]);

	const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		if (!containerRef.current) return;

		const rect = containerRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const width = rect.width;
		const threshold = width * 0.2;

		if (x < threshold) {
			setHoverPosition(0);
		} else if (x > width - threshold) {
			setHoverPosition(1);
		} else {
			setHoverPosition(null);
		}
	}, []);

	// Format date for better accessibility
	const formatDate = useCallback((dateString: Date) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}).format(date);
	}, []);

	if (upcomingEventsLoading || !eventList.length) return null;
	return (
		<section
			ref={containerRef}
			className="relative h-[calc(100vh-5rem)] overflow-hidden "
			onMouseMove={handleMouseMove}
			aria-roledescription="carousel"
			aria-label="Featured events"
		>
			{/* Carousel items */}
			<div className="h-full relative">
				{eventList.map((event: Event, index: number) => (
					<div
						key={event._id}
						className={cn(
							'absolute inset-0 transition-all duration-1000 ease-in-out',
							index === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0',
						)}
						aria-hidden={index !== currentIndex}
						role="group"
						aria-roledescription="slide"
						aria-label={`${index + 1} of ${eventList.length}: ${event.eventName}`}
					>
						<div
							className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-in-out"
							style={{ backgroundImage: `url(${event.eventImage})` }}
							aria-hidden="true"
						>
							{/* Gradient overlays for navigation */}
							{hoverPosition === 0 && (
								<div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black/90 to-transparent" />
							)}
							{hoverPosition === 1 && (
								<div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black/90 to-transparent" />
							)}
							<div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/70" />
						</div>

						<div className="absolute inset-0 flex items-center justify-center flex-col">
							<div className="text-center text-white max-w-4xl px-4 sm:px-6 md:px-8 transform transition-all duration-1000 ease-in-out  backdrop-blur-xs my-2">
								<div className="mb-4 flex flex-wrap justify-center gap-2">
									{event.eventCategories.map((category, catIndex) => (
										<span
											key={catIndex}
											className="block   text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-gray-800/50 transition-colors duration-300"
										>
											#{category}
										</span>
									))}
								</div>
								<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6   text-white px-4 py-3 rounded-lg">
									{event.eventName}
								</h2>
								<p className="text-lg sm:text-xl mb-6 sm:mb-8 text-white max-w-2xl mx-auto   px-4 py-3 rounded-lg">
									{event.eventDesc}
								</p>
								<div className="flex flex-col sm:flex-row justify-center sm:space-x-6 space-y-3 sm:space-y-0 mb-2 sm:mb-4">
									<span className="flex items-center justify-center sm:justify-start   px-4 py-2 rounded-full text-white">
										<MapPin className="w-5 h-5 mr-2" />
										<span>{event.eventAddress}</span>
									</span>
									<span className="flex items-center justify-center sm:justify-start   px-4 py-2 rounded-full text-white">
										<Calendar className="w-5 h-5 mr-2" />
										<time dateTime={new Date(event.eventDate).toISOString()}>{formatDate(event.eventDate)}</time>
									</span>
								</div>
							</div>
							<Link
								href={`/events/${event._id}`}
								className="inline-block bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium hover:bg-primary/90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
								aria-label={`View details for ${event.eventName}`}
							>
								View Details
							</Link>
						</div>
					</div>
				))}
			</div>

			{/* Navigation buttons with improved accessibility */}
			<button
				onClick={() => handleNavigation('prev')}
				className="absolute inset-y-0 left-0 w-1/5 cursor-pointer group flex items-center justify-start pl-4 sm:pl-6 md:pl-8 z-20 focus-visible:outline-0"
				aria-label="Previous event"
			>
				<span className="sr-only">Previous</span>

				<ChevronLeft
					className={cn(
						'w-8 h-8 text-foreground/0 group-hover:text-white/80 transition-all duration-300',
						hoverPosition === 0 ? 'text-foreground/80' : '',
					)}
				/>
			</button>
			<button
				onClick={() => handleNavigation('next')}
				className="absolute inset-y-0 right-0 w-1/5 cursor-pointer group flex items-center justify-end pr-4 sm:pr-6 md:pr-8 z-20 focus-visible:outline-0"
				aria-label="Next event"
			>
				<span className="sr-only">Next</span>

				<ChevronRight
					className={cn(
						'w-8 h-8 text-foreground/0 group-hover:text-white/80 transition-all duration-300',
						hoverPosition === 1 ? 'text-foreground/80' : '',
					)}
				/>
			</button>

			{/* Carousel controls */}
			<div className="absolute bottom-8 left-0 right-0 flex flex-col items-center space-y-4 z-20">
				<div className="flex justify-center items-center space-x-2" role="tablist" aria-label="Event slides">
					{eventList.map((event, index) => (
						<button
							key={index}
							className={cn(
								' rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50',
								index === currentIndex ? 'bg-primary scale-125 w-2.5 h-2.5' : 'bg-white/50 hover:bg-white/75 w-2 h-2',
							)}
							onClick={() => setCurrentIndex(index)}
							aria-label={`Go to slide ${index + 1}: ${event.eventName}`}
							aria-selected={index === currentIndex}
							role="tab"
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default AutoScrollEvents;
