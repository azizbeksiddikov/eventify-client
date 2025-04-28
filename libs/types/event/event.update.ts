import { EventStatus, EventCategory } from '../../enums/event.enum';

export interface EditEventInput {
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
}
