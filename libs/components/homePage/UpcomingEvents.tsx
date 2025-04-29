'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar } from '@/components/ui/calendar';
import { MapPin, Clock, CalendarIcon, ChevronRight } from 'lucide-react';

interface Event {
	id: string;
	title: string;
	date: string;
	time: string;
	location: string;
	category: string;
}

export default function UpcomingEvents() {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
	const [events] = useState<Event[]>([
		{
			id: '1',
			title: 'Summer Music Festival',
			date: '2024-07-15',
			time: '14:00',
			location: 'Central Park, New York',
			category: 'Music',
		},
		{
			id: '2',
			title: 'Tech Conference 2024',
			date: '2024-07-15',
			time: '09:00',
			location: 'San Francisco, CA',
			category: 'Technology',
		},
		{
			id: '3',
			title: 'Food & Wine Expo',
			date: '2024-07-20',
			time: '18:00',
			location: 'Chicago, IL',
			category: 'Food & Drink',
		},
		{
			id: '4',
			title: 'Art Exhibition Opening',
			date: '2024-07-22',
			time: '19:00',
			location: 'Modern Art Gallery, Los Angeles',
			category: 'Art',
		},
		{
			id: '5',
			title: 'Yoga Retreat Weekend',
			date: '2024-07-25',
			time: '08:00',
			location: 'Serenity Resort, Colorado',
			category: 'Wellness',
		},
	]);

	const getEventsForDate = (date: Date | undefined) => {
		if (!date) return [];
		return events.filter((event) => new Date(event.date).toDateString() === date.toDateString());
	};

	const filteredEvents = getEventsForDate(selectedDate);

	return (
		<section className="mt-8">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold text-[#111111]">Upcoming Events</h2>
				<button className="text-[#E60023] hover:text-[#CC0000] transition-colors duration-200 text-sm font-medium">
					View All Events
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				{/* Large Calendar - Takes most of the space */}
				<div className="md:col-span-3 bg-white rounded-2xl shadow-sm p-6">
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
							caption_label: 'text-xl font-semibold text-[#111111]',
							nav: 'space-x-1 flex items-center',
							nav_button: 'h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-full hover:bg-gray-100',
							nav_button_previous: 'absolute left-1',
							nav_button_next: 'absolute right-1',
							table: 'w-full border-collapse space-y-1',
							head_row: 'flex w-full',
							head_cell: 'text-[#6E6E6E] rounded-md w-full font-medium text-sm',
							row: 'flex w-full mt-2',
							cell: 'h-12 w-full text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
							day: 'h-12 w-12 p-0 mx-auto font-normal aria-selected:opacity-100 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center',
							day_selected:
								'bg-[#E60023] text-white hover:bg-[#E60023] hover:text-white focus:bg-[#E60023] focus:text-white',
							day_today: 'text-[#111111] font-medium',
							day_outside: 'text-[#6E6E6E] opacity-50',
							day_disabled: 'text-[#6E6E6E] opacity-50',
							day_range_middle: 'aria-selected:bg-[#F5F5F5] aria-selected:text-[#111111]',
							day_hidden: 'invisible',
						}}
					/>
				</div>

				{/* Events List - Simple bullet points */}
				<div className="md:col-span-1">
					<div className="bg-white rounded-2xl shadow-sm p-5 h-full">
						<div className="flex items-center mb-4">
							<CalendarIcon className="w-5 h-5 text-[#E60023] mr-2" />
							<h3 className="text-lg font-semibold text-[#111111]">
								{selectedDate?.toLocaleDateString('en-US', {
									month: 'long',
									day: 'numeric',
									year: 'numeric',
								})}
							</h3>
						</div>

						{filteredEvents.length > 0 ? (
							<ul className="space-y-3">
								{filteredEvents.map((event) => (
									<li key={event.id} className="border-l-2 border-[#E60023] pl-3 py-1">
										<Link
											href={`/events/${event.id}`}
											className="block group hover:bg-gray-50 -ml-3 pl-3 pr-2 py-2 rounded-r-lg transition-colors"
										>
											<div className="flex justify-between items-start">
												<h4 className="font-medium text-[#111111] text-sm group-hover:text-[#E60023] transition-colors line-clamp-1">
													{event.title}
												</h4>
												<ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#E60023] transition-colors flex-shrink-0 mt-0.5" />
											</div>
											<div className="flex items-center mt-1 text-xs text-[#6E6E6E]">
												<Clock className="w-3.5 h-3.5 mr-1.5" />
												{event.time}
											</div>
											<div className="flex items-center mt-1 text-xs text-[#6E6E6E]">
												<MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
												<span className="truncate">{event.location}</span>
											</div>
										</Link>
									</li>
								))}
							</ul>
						) : (
							<div className="flex flex-col items-center justify-center h-[calc(100%-2rem)] text-center">
								<CalendarIcon className="w-10 h-10 text-gray-300 mb-2" />
								<p className="text-[#6E6E6E] text-sm">No events scheduled</p>
								<p className="text-[#6E6E6E] text-xs mt-1">Select another date</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
