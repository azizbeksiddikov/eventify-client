import { Direction } from '../../enums/common.enum';

export enum EventStatus {
	UPCOMING = 'UPCOMING',
	ONGOING = 'ONGOING',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED',
}

export enum EventCategory {
	TECHNOLOGY = 'TECHNOLOGY',
	BUSINESS = 'BUSINESS',
	ART = 'ART',
	MUSIC = 'MUSIC',
	SPORTS = 'SPORTS',
	FOOD = 'FOOD',
	EDUCATION = 'EDUCATION',
	HEALTH = 'HEALTH',
	OTHER = 'OTHER',
}

export interface EventInput {
	id: string;
	eventName: string;
	eventDesc: string;
	eventImage: string;
	eventDate: Date;
	eventStartTime: string;
	eventEndTime: string;
	eventAddress: string;
	eventCapacity: number;
	eventPrice: number;
	eventStatus: EventStatus;
	eventCategories: EventCategory[];
	groupId: string;
	organizerId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface EventSearch {
	text?: string;
	categories?: EventCategory[];
	status?: EventStatus;
	startDate?: Date;
	endDate?: Date;
	minPrice?: number;
	maxPrice?: number;
}

export interface EventPagination {
	page: number;
	limit: number;
	sortBy?: keyof EventInput;
	sortOrder?: 'asc' | 'desc';
	search?: EventSearch;
}

export interface EISearch {
	text?: string;
	eventCategories?: EventCategory[];
	eventStatus?: EventStatus;
}

export interface EventsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: EISearch;
}

export interface OrdinaryEventInquiry {
	page: number;
	limit: number;
}
