import { EventStatus, EventCategory } from '@/libs/enums/event.enum';

export interface EventUpdateInput {
	_id: string;
	eventName?: string;
	eventDesc?: string;
	eventImage?: string;
	eventDate?: Date;
	eventStartTime?: string;
	eventEndTime?: string;
	eventAddress?: string;
	eventCity?: string;
	eventCapacity?: number;
	eventPrice?: number;
	eventStatus?: EventStatus;
	eventCategories?: EventCategory[];
}
