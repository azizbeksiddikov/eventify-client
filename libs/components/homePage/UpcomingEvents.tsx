import { useState } from 'react';
import Link from 'next/link';

interface Event {
	id: string;
	title: string;
	date: string;
	location: string;
	type: string;
}

const UpcomingEvents = () => {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [events, setEvents] = useState<Event[]>([
		{
			id: '1',
			title: 'Summer Music Festival',
			date: '2024-07-15',
			location: 'Central Park, New York',
			type: 'festival',
		},
		{
			id: '2',
			title: 'Tech Conference 2024',
			date: '2024-08-20',
			location: 'San Francisco, CA',
			type: 'conference',
		},
		{
			id: '3',
			title: 'Food & Wine Expo',
			date: '2024-09-10',
			location: 'Chicago, IL',
			type: 'exhibition',
		},
	]);

	const getDaysInMonth = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		return new Date(year, month + 1, 0).getDate();
	};

	const getFirstDayOfMonth = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		return new Date(year, month, 1).getDay();
	};

	const daysInMonth = getDaysInMonth(selectedDate);
	const firstDay = getFirstDayOfMonth(selectedDate);

	const renderCalendar = () => {
		const days = [];
		const today = new Date();

		// Add empty cells for days before the first day of the month
		for (let i = 0; i < firstDay; i++) {
			days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200" />);
		}

		// Add cells for each day of the month
		for (let day = 1; day <= daysInMonth; day++) {
			const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
			const dayEvents = events.filter((event) => {
				const eventDate = new Date(event.date);
				return eventDate.toDateString() === currentDate.toDateString();
			});

			const isToday = currentDate.toDateString() === today.toDateString();

			days.push(
				<div key={day} className={`h-24 border border-gray-200 p-2 ${isToday ? 'bg-indigo-50' : ''}`}>
					<div className="font-medium">{day}</div>
					<div className="mt-1 space-y-1">
						{dayEvents.map((event) => (
							<Link
								key={event.id}
								href={`/events/${event.id}`}
								className="block text-sm text-indigo-600 hover:text-indigo-800 truncate"
							>
								{event.title}
							</Link>
						))}
					</div>
				</div>,
			);
		}

		return days;
	};

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const handlePrevMonth = () => {
		setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
	};

	const handleNextMonth = () => {
		setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
				<Link href="/events" className="text-indigo-600 hover:text-indigo-800 font-medium">
					View All Events
				</Link>
			</div>

			<div className="bg-white rounded-lg shadow">
				<div className="p-4 border-b border-gray-200">
					<div className="flex justify-between items-center">
						<button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
						</button>
						<h3 className="text-lg font-semibold">
							{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
						</h3>
						<button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</button>
					</div>
				</div>

				<div className="grid grid-cols-7 gap-px bg-gray-200">
					{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
						<div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500">
							{day}
						</div>
					))}
					{renderCalendar()}
				</div>
			</div>
		</div>
	);
};

export default UpcomingEvents;
