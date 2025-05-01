import { useEffect, useState } from 'react';
import { Event } from '@/libs/types/event/event';
import { EventPanelList } from '@/libs/components/admin/events/EventList';
import { EventSearch } from '@/libs/components/admin/events/EventSearch';
import { Button } from '@/libs/components/ui/button';
import { Separator } from '@/libs/components/ui/separator';
import { mockEvents } from '@/data';
import { Direction } from '@/libs/enums/common.enum';
import { EventStatus, EventCategory } from '@/libs/enums/event.enum';
import withAdminLayout from '@/libs/components/layout/LayoutAdmin';

interface EventsInquiry {
	page: number;
	limit: number;
	sort: string;
	direction: Direction;
	search: {
		text: string;
		category?: EventCategory;
		status?: EventStatus;
	};
}

const EventsPage = () => {
	const [eventsInquiry, setEventsInquiry] = useState<EventsInquiry>({
		page: 1,
		limit: 10,
		sort: 'eventDate',
		direction: Direction.ASC,
		search: {
			text: '',
			category: undefined,
			status: undefined,
		},
	});

	const [events, setEvents] = useState<Event[]>([]);

	useEffect(() => {
		// In a real application, this would be an API call
		setEvents(mockEvents);
	}, []);

	const updateEventHandler = async (data: {
		_id: string;
		eventName?: string;
		eventDesc?: string;
		eventImage?: string;
		eventDate?: Date;
		eventStartTime?: string;
		eventEndTime?: string;
		eventAddress?: string;
		eventCapacity?: number;
		eventPrice?: number;
		eventStatus?: EventStatus;
		eventCategories?: EventCategory[];
	}) => {
		try {
			// In a real application, this would be an API call
			setEvents((prevEvents) =>
				prevEvents.map((event) => {
					if (event._id === data._id) {
						return {
							...event,
							eventName: data.eventName ?? event.eventName,
							eventDesc: data.eventDesc ?? event.eventDesc,
							eventImage: data.eventImage ?? event.eventImage,
							eventDate: data.eventDate ?? event.eventDate,
							eventStartTime: data.eventStartTime ?? event.eventStartTime,
							eventEndTime: data.eventEndTime ?? event.eventEndTime,
							eventAddress: data.eventAddress ?? event.eventAddress,
							eventCapacity: data.eventCapacity ?? event.eventCapacity,
							eventPrice: data.eventPrice ?? event.eventPrice,
							eventStatus: data.eventStatus ?? event.eventStatus,
							eventCategories: data.eventCategories ?? event.eventCategories,
							updatedAt: new Date(),
						};
					}
					return event;
				}),
			);
			alert('Event updated successfully');
		} catch {
			alert('Failed to update event');
		}
	};

	const deleteEventHandler = async (eventId: string) => {
		try {
			// In a real application, this would be an API call
			setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
			alert('Event deleted successfully');
		} catch {
			alert('Failed to delete event');
		}
	};

	const changePageHandler = (page: number) => {
		setEventsInquiry((prev) => ({
			...prev,
			page,
		}));
	};

	return (
		<div className="space-y-8 p-6">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">Events</h2>
			</div>
			<Separator />
			<div className="space-y-6">
				<EventSearch eventsInquiry={eventsInquiry} setEventsInquiry={setEventsInquiry} />
				<EventPanelList
					events={events}
					updateEventHandler={updateEventHandler}
					deleteEventHandler={deleteEventHandler}
				/>
				<div className="flex items-center justify-end space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => changePageHandler(eventsInquiry.page - 1)}
						disabled={eventsInquiry.page === 1}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => changePageHandler(eventsInquiry.page + 1)}
						disabled={events.length < eventsInquiry.limit}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
};

export default withAdminLayout(EventsPage);
