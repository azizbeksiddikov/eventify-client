import { Direction } from '@/libs/enums/common.enum';
import { EventStatus, EventCategory } from '@/libs/enums/event.enum';

export interface EventInput {
	eventName: string;
	eventDesc: string;
	eventImage: string;
	eventDate: Date;
	eventStartTime: string; // hh:mm
	eventEndTime: string; // hh:mm
	eventAddress: string;
	eventCapacity?: number;
	eventPrice?: number;
	eventStatus: EventStatus;
	eventCity: string;
	eventCategories: EventCategory[];
	groupId: string;
}

export interface EISearch {
	text?: string;
	eventCategories?: EventCategory[];
	eventStatus?: EventStatus;
	eventStartDay?: Date;
	eventEndDay?: Date;
	eventAddress?: string;
	eventCity?: string;
}

export interface EventsInquiry {
	page: number;
	limit?: number;
	sort?: string;
	direction?: Direction;
	search: EISearch;
}

export interface OrdinaryEventInquiry {
	page: number;
	limit: number;
}

export interface EventsByCategoryInquiry {
	categories: EventCategory[];
	limit: number;
}
