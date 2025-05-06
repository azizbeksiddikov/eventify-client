import React from 'react';
import { useTranslation } from 'react-i18next';

import { Separator } from '@/libs/components/ui/separator';
import PaginationComponent from '@/libs/components/common/PaginationComponent';

import { EventUpdateInput } from '@/libs/types/event/event.update';
import { EventsInquiry } from '@/libs/types/event/event.input';
import { Events } from '@/libs/types/event/event';
import { EventSearch } from './EventSearch';
import { EventPanelList } from './EventList';

interface EventsInquiryProps {
	events: Events;
	initialInquiry: EventsInquiry;
	eventsInquiry: EventsInquiry;
	setEventsInquiry: (eventsInquiry: EventsInquiry) => void;
	updateEventHandler: (event: EventUpdateInput) => Promise<void>;
	removeEventHandler: (eventId: string) => Promise<void>;
}

const EventsModule = ({
	events,
	initialInquiry,
	eventsInquiry,
	setEventsInquiry,
	updateEventHandler,
	removeEventHandler,
}: EventsInquiryProps) => {
	const { t } = useTranslation();
	const eventsTotal = events.metaCounter[0]?.total ?? 0;

	/** HANDLERS **/

	const pageChangeHandler = (newPage: number) => {
		setEventsInquiry({ ...eventsInquiry, page: newPage });
	};

	return (
		<div className="p-6 bg-background">
			<h2 className="text-2xl font-bold mb-6 text-foreground">{t('Event List')}</h2>
			<div className="bg-card rounded-lg shadow border border-border">
				<EventSearch
					initialInquiry={initialInquiry}
					eventsInquiry={eventsInquiry}
					setEventsInquiry={setEventsInquiry}
				/>
				<Separator className="bg-border" />
				<div className="p-4 my-4 gap-4 flex flex-col">
					<EventPanelList
						events={events}
						updateEventHandler={updateEventHandler}
						removeEventHandler={removeEventHandler}
					/>
					<PaginationComponent
						totalItems={eventsTotal ?? 0}
						currentPage={eventsInquiry.page}
						limit={eventsInquiry.limit}
						pageChangeHandler={pageChangeHandler}
					/>
				</div>
			</div>
		</div>
	);
};

export default EventsModule;
