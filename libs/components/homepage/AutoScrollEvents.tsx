"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import ReactMarkdown from "react-markdown";

// Apollo
import { useQuery } from "@apollo/client/react";
import { GET_UNIQUE_EVENTS } from "@/apollo/user/query";

// Types
import { Direction } from "@/libs/enums/common.enum";
import { EventStatus, EventLocationType } from "@/libs/enums/event.enum";

import { EventsInquiry } from "@/libs/types/event/event.input";
import { Event } from "@/libs/types/event/event";

// Styles
import { Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { cn, getImageUrl } from "@/libs/utils";
import Loading from "../common/Loading";

interface AutoScrollEventsProps {
	initialInput?: EventsInquiry;
}

const AutoScrollEvents = ({
	initialInput = {
		page: 1,
		limit: 12,
		sort: "eventStartAt",
		direction: Direction.ASC,
		search: { eventStatus: EventStatus.UPCOMING },
	},
}: AutoScrollEventsProps) => {
	const { t, i18n } = useTranslation("home");
	const [currentIndex, setCurrentIndex] = useState(0);
	const [hoverPosition, setHoverPosition] = useState<number | null>(null);
	const [isAutoScrolling, setIsAutoScrolling] = useState(true);
	const containerRef = useRef<HTMLDivElement>(null);
	const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const lastInteractionTimeRef = useRef<number>(0);
	const resumeAutoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const {
		data: upcomingEvents,
		loading: upcomingEventsLoading,
		error: upcomingEventsError,
	} = useQuery(GET_UNIQUE_EVENTS, {
		variables: { input: initialInput },
		fetchPolicy: "cache-and-network",
		notifyOnNetworkStatusChange: true,
	});

	const eventList: Event[] = upcomingEvents?.getUniqueEvents?.list || [];

	// Handle click/interaction - stops auto-scroll temporarily
	const handleUserInteraction = useCallback(() => {
		lastInteractionTimeRef.current = Date.now();
		setIsAutoScrolling(false);

		// Clear existing intervals and timeouts
		if (autoScrollIntervalRef.current) {
			clearInterval(autoScrollIntervalRef.current);
			autoScrollIntervalRef.current = null;
		}
		if (resumeAutoScrollTimeoutRef.current) {
			clearTimeout(resumeAutoScrollTimeoutRef.current);
			resumeAutoScrollTimeoutRef.current = null;
		}

		// Resume auto-scrolling after 4 seconds of inactivity
		resumeAutoScrollTimeoutRef.current = setTimeout(() => {
			setIsAutoScrolling(true);
		}, 4000);
	}, []);

	// Handle keyboard navigation with proper dependencies
	const navigationHandler = useCallback(
		(direction: "prev" | "next") => {
			handleUserInteraction();

			setCurrentIndex((prevIndex) => {
				if (direction === "prev") {
					return (prevIndex - 1 + eventList.length) % eventList.length;
				}
				return (prevIndex + 1) % eventList.length;
			});
		},
		[eventList.length, handleUserInteraction],
	);

	// Handle keyboard navigation
	const keyDownHandler = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") {
				navigationHandler("prev");
			} else if (e.key === "ArrowRight") {
				navigationHandler("next");
			}
		},
		[navigationHandler],
	);

	// Setup and cleanup keyboard event listeners
	useEffect(() => {
		window.addEventListener("keydown", keyDownHandler);
		return () => {
			window.removeEventListener("keydown", keyDownHandler);
		};
	}, [keyDownHandler]);

	// Auto-scroll functionality - changes every 3 seconds
	useEffect(() => {
		if (!eventList.length || !isAutoScrolling) return;

		autoScrollIntervalRef.current = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % eventList.length);
		}, 3000);

		return () => {
			if (autoScrollIntervalRef.current) {
				clearInterval(autoScrollIntervalRef.current);
				autoScrollIntervalRef.current = null;
			}
		};
	}, [eventList.length, isAutoScrolling]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (resumeAutoScrollTimeoutRef.current) {
				clearTimeout(resumeAutoScrollTimeoutRef.current);
			}
		};
	}, []);

	const moveMouseHandler = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
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
	const formatDate = useCallback(
		(dateString: Date) => {
			const date = new Date(dateString);
			return new Intl.DateTimeFormat(i18n.language || "en-US", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			}).format(date);
		},
		[i18n.language],
	);

	// Get event location with fallback
	const getEventLocation = useCallback(
		(event: Event) => {
			if (event.eventAddress) return event.eventAddress;
			if (event.eventCity) return event.eventCity;
			if (event.locationType === EventLocationType.ONLINE) return t("online_event");
			return t("location_tba");
		},
		[t],
	);

	if (upcomingEventsLoading) return <Loading />;
	if (upcomingEventsError)
		return (
			<div>
				{t("error")}: {upcomingEventsError.message}
			</div>
		);
	if (!eventList.length) return null; // Section disappears if no featured events are found

	return (
		<section
			ref={containerRef}
			className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[calc(100vh-5rem)] overflow-hidden w-full min-w-0"
			onMouseMove={moveMouseHandler}
			onContextMenu={(e) => {
				e.preventDefault(); // Prevent the default context menu
				navigationHandler("next"); // Navigate to next slide on right-click
				return false;
			}}
			aria-roledescription="carousel"
			aria-label={t("featured_events")}
		>
			{/* Carousel items */}
			<div className="h-full relative">
				{eventList.map((event: Event, index: number) => (
					<div
						key={event._id}
						className={cn(
							"absolute inset-0 transition-all duration-1000 ease-in-out",
							index === currentIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0",
						)}
						aria-hidden={index !== currentIndex}
						role="group"
						aria-roledescription="slide"
						aria-label={`${index + 1} of ${eventList.length}: ${event.eventName}`}
					>
						<div
							className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-in-out"
							style={{ backgroundImage: `url(${getImageUrl(event.eventImages[0], "event", event.origin)})` }}
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

						<div className="absolute inset-0 flex items-center justify-center flex-col px-4">
							<div className="text-center text-white max-w-4xl w-full px-2 sm:px-4 md:px-6 lg:px-8 transform transition-all duration-1000 ease-in-out my-2">
								<div className="mb-3 sm:mb-4 flex flex-wrap justify-center gap-1.5 sm:gap-2">
									{event.eventCategories.map((category, catIndex) => (
										<span
											key={catIndex}
											className="block text-white bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-white/20 transition-colors duration-300 cursor-pointer"
											onClick={handleUserInteraction}
										>
											#{category}
										</span>
									))}
								</div>
								<h2
									className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 text-white px-2 sm:px-4 py-2 sm:py-3 rounded-lg cursor-pointer break-words"
									onClick={handleUserInteraction}
								>
									{event.eventName}
								</h2>
								<div
									className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8 text-white max-w-2xl mx-auto px-2 sm:px-4 py-2 sm:py-3 rounded-lg cursor-pointer overflow-hidden"
									onClick={handleUserInteraction}
								>
									<div className="line-clamp-2 sm:line-clamp-3 [&>*]:text-white [&>p]:mb-2 [&>p]:last:mb-0 [&>strong]:font-semibold [&>a]:text-white [&>a]:underline [&>a:hover]:text-white/80">
										<ReactMarkdown
											components={{
												a: ({ ...props }) => (
													<a
														{...props}
														className="text-white hover:text-white/80 underline font-medium break-all"
														target="_blank"
														rel="noopener noreferrer"
													/>
												),
												strong: ({ ...props }) => <strong {...props} className="font-semibold text-white" />,
												p: ({ ...props }) => <p {...props} className="mb-2 last:mb-0 text-white" />,
												ul: ({ ...props }) => <ul {...props} className="list-disc pl-5 mb-2 space-y-1 text-white" />,
												ol: ({ ...props }) => <ol {...props} className="list-decimal pl-5 mb-2 space-y-1 text-white" />,
												li: ({ ...props }) => <li {...props} className="pl-1 text-white" />,
												h1: ({ ...props }) => (
													<h1 {...props} className="text-lg font-bold text-white mb-2 mt-2 first:mt-0" />
												),
												h2: ({ ...props }) => (
													<h2 {...props} className="text-base font-bold text-white mb-2 mt-2 first:mt-0" />
												),
												h3: ({ ...props }) => (
													<h3 {...props} className="text-sm font-bold text-white mb-2 mt-2 first:mt-0" />
												),
												blockquote: ({ ...props }) => (
													<blockquote
														{...props}
														className="border-l-4 border-white/30 pl-4 py-1 italic mb-2 text-white/80"
													/>
												),
											}}
										>
											{event.eventDesc}
										</ReactMarkdown>
									</div>
								</div>
								<div className="flex flex-col sm:flex-row justify-center sm:space-x-4 md:space-x-6 space-y-2 sm:space-y-0 mb-3 sm:mb-4">
									<span
										className="flex items-center justify-center sm:justify-start bg-black/30 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white text-xs sm:text-sm"
										onClick={handleUserInteraction}
									>
										<MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 shrink-0" />
										<span className="truncate">{getEventLocation(event)}</span>
									</span>
									<span
										className="flex items-center justify-center sm:justify-start bg-black/30 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white text-xs sm:text-sm"
										onClick={handleUserInteraction}
									>
										<Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 shrink-0" />
										<time dateTime={new Date(event.eventStartAt).toISOString()} className="truncate">
											{formatDate(event.eventStartAt)}
										</time>
									</span>
								</div>
							</div>
							<Link
								href={`/events/${event._id}`}
								className="inline-block bg-primary text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full text-sm sm:text-base font-medium hover:bg-primary/90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
								aria-label={`${t("events_view_details_for")} ${event.eventName}`}
								onClick={handleUserInteraction}
							>
								{t("events_view_details")}
							</Link>
						</div>
					</div>
				))}
			</div>

			{/* Navigation buttons with improved accessibility */}
			<button
				onClick={() => navigationHandler("prev")}
				onContextMenu={(e) => {
					e.preventDefault();
					navigationHandler("prev");
					return false;
				}}
				className="absolute inset-y-0 left-0 w-1/5 cursor-pointer group flex items-center justify-start pl-4 sm:pl-6 md:pl-8 z-20 focus-visible:outline-0"
				aria-label="Previous event"
			>
				<span className="sr-only">Previous</span>

				<ChevronLeft
					className={cn(
						"w-8 h-8 text-foreground/0 group-hover:text-white/80 transition-all duration-300",
						hoverPosition === 0 ? "text-foreground/80" : "",
					)}
				/>
			</button>
			<button
				onClick={() => navigationHandler("next")}
				onContextMenu={(e) => {
					e.preventDefault();
					navigationHandler("next");
					return false;
				}}
				className="absolute inset-y-0 right-0 w-1/5 cursor-pointer group flex items-center justify-end pr-4 sm:pr-6 md:pr-8 z-20 focus-visible:outline-0"
				aria-label="Next event"
			>
				<span className="sr-only">Next</span>

				<ChevronRight
					className={cn(
						"w-8 h-8 text-foreground/0 group-hover:text-white/80 transition-all duration-300",
						hoverPosition === 1 ? "text-foreground/80" : "",
					)}
				/>
			</button>

			{/* Carousel controls */}
			<div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 flex flex-col items-center space-y-3 sm:space-y-4 z-20">
				<div
					className="flex justify-center items-center space-x-1.5 sm:space-x-2"
					role="tablist"
					aria-label="Event slides"
				>
					{eventList.map((event, index) => (
						<button
							key={index}
							className={cn(
								"rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50",
								index === currentIndex ? "bg-primary scale-125 w-2.5 h-2.5" : "bg-white/50 hover:bg-white/75 w-2 h-2",
							)}
							onClick={() => {
								handleUserInteraction();
								setCurrentIndex(index);
							}}
							onContextMenu={(e) => {
								e.preventDefault();
								handleUserInteraction();
								setCurrentIndex(index);
								return false;
							}}
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
