import { useState } from 'react';
import Link from 'next/link';
import { Calendar } from '@/libs/components/ui/calendar';
import { MapPin, Clock, CalendarIcon, ChevronRight } from 'lucide-react';
import { eventList } from '@/data';
import { Event } from '@/libs/types/event/event';

export default function UpcomingEvents() {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
	const getEventsForDate = (date: Date | undefined) => {
		if (!date) return [];

		return eventList.filter((event) => new Date(event.eventDate).toDateString() === date.toDateString());
	};

	const filteredEvents = getEventsForDate(selectedDate);

	const hasEvents = (date: Date) => {
		return eventList.some((event) => new Date(event.eventDate).toDateString() === date.toDateString());
	};

	return (
		<section className="m-20">
			<div className="w-[90%] mx-auto">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
					<Link
						href="/events"
						className="text-primary hover:text-primary/80 transition-colors duration-200 text-sm font-medium"
					>
						View All Events
					</Link>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					{/* Large Calendar - Takes most of the space */}
					<div className="md:col-span-3 bg-card rounded-2xl shadow-sm p-6">
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={(date) => {
								console.log(date);
								setSelectedDate(date);
							}}
							className="rounded-md border-0 w-full"
							classNames={{
								months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full justify-center',
								month: 'space-y-4 w-full',
								caption: 'flex justify-center pt-1 relative items-center',
								caption_label: 'text-xl font-semibold text-foreground',
								nav: 'space-x-1 flex items-center',
								nav_button: 'h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-full hover:bg-muted',
								nav_button_previous: 'absolute left-1',
								nav_button_next: 'absolute right-1',
								table: 'w-full border-collapse space-y-1',
								head_row: 'flex w-full',
								head_cell: 'text-muted-foreground rounded-md w-full font-medium text-sm',
								row: 'flex w-full mt-2',
								cell: 'h-12 w-full text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
								day: 'h-12 w-12 p-0 mx-auto font-normal aria-selected:opacity-100 rounded-full hover:bg-muted flex items-center justify-center',
								day_selected:
									'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
								day_today: 'text-foreground font-medium',
								day_outside: 'text-muted-foreground opacity-50',
								day_disabled: 'text-muted-foreground opacity-50',
								day_range_middle: 'aria-selected:bg-muted aria-selected:text-foreground',
								day_hidden: 'invisible',
							}}
							components={{
								DayContent: ({ date }) => (
									<div className="flex flex-col items-center">
										<span>{date.getDate()}</span>
										{hasEvents(date) && <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />}
									</div>
								),
							}}
						/>
					</div>

					{/* Events List - Simple bullet points */}
					<div className="md:col-span-1">
						<div className="bg-card rounded-2xl shadow-sm p-5 h-full">
							<div className="flex items-center mb-4">
								<CalendarIcon className="w-5 h-5 text-primary mr-2" />
								<h3 className="text-lg font-semibold text-foreground">
									{selectedDate?.toLocaleDateString('en-US', {
										month: 'long',
										day: 'numeric',
										year: 'numeric',
									})}
								</h3>
							</div>

							{filteredEvents.length > 0 ? (
								<ul className="space-y-3">
									{filteredEvents.map((event: Event) => (
										<li key={event._id} className="border-l-2 border-primary pl-3 py-1">
											<Link
												href={`/events/${event._id}`}
												className="block group hover:bg-muted -ml-3 pl-3 pr-2 py-2 rounded-r-lg transition-colors"
											>
												<div className="flex justify-between items-start">
													<h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1">
														{event.eventName}
													</h4>
													<ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
												</div>
												<div className="flex items-center mt-1 text-xs text-muted-foreground">
													<Clock className="w-3.5 h-3.5 mr-1.5" />
													{event.eventDate.toLocaleDateString('en-US', {
														month: 'long',
														day: 'numeric',
														year: 'numeric',
													})}
												</div>
												<div className="flex items-center mt-1 text-xs text-muted-foreground">
													<MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
													<span className="truncate">{event.eventAddress}</span>
												</div>
											</Link>
										</li>
									))}
								</ul>
							) : (
								<div className="flex flex-col items-center justify-center h-[calc(100%-2rem)] text-center">
									<CalendarIcon className="w-10 h-10 text-muted-foreground/30 mb-2" />
									<p className="text-muted-foreground text-sm">No events scheduled</p>
									<p className="text-muted-foreground text-xs mt-1">Select another date</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
