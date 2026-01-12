import { Direction } from "@/libs/enums/common.enum";
import { EventStatus, EventCategory, EventType, RecurrenceType, EventLocationType } from "@/libs/enums/event.enum";

// ============== Event Creation Input ==============
export interface EventInput {
	// ===== Event Type =====
	eventType?: EventType;

	// ===== Basic Information =====
	recurrenceId?: string;
	eventName: string;
	eventDesc: string;
	eventImages: string[];

	// ===== Event Timestamps =====
	eventStartAt: Date;
	eventEndAt: Date;

	// ===== Location Details =====
	locationType: EventLocationType;
	eventCity?: string;
	eventAddress?: string;

	// Coordinates
	coordinateLatitude?: number;
	coordinateLongitude?: number;

	// ===== Event Details =====
	eventCapacity?: number;
	eventPrice?: number;
	eventCurrency?: string;

	// ===== Type and Status =====
	eventStatus?: EventStatus;
	eventCategories: EventCategory[];
	eventTags: string[];
	isRealEvent?: boolean;

	// ===== Internal References =====
	groupId?: string;

	// ===== External Source Information =====
	origin?: string;
	externalId?: string;
	externalUrl?: string;

	attendeeCount?: number;
}

// ============== Search Inputs ==============
export interface EISearch {
	text?: string;
	eventCategories?: EventCategory[];
	eventStatus?: EventStatus;
	eventStartDay?: Date;
	eventEndDay?: Date;
	eventCity?: string;
	eventAddress?: string;
}

// ============== Inquiry Inputs ==============
export interface EventsInquiry {
	// ===== Pagination =====
	page: number;
	limit?: number;

	// ===== Sorting =====
	sort?: string;
	direction?: Direction;

	// ===== Search =====
	search: EISearch;
}

export interface OrdinaryEventInquiry {
	// ===== Pagination =====
	page: number;
	limit: number;
}

export interface EventsByCategoryInquiry {
	categories: EventCategory[];
	limit: number;
}

export interface EventRecurrenceInput {
	// ===== Recurrence Rules =====
	recurrenceType: RecurrenceType;
	recurrenceInterval?: number;
	recurrenceDaysOfWeek?: number[];
	recurrenceDayOfMonth?: number;
	recurrenceEndDate?: Date;

	// ===== Template Fields =====
	eventName: string;
	eventDesc: string;
	eventImages: string[];
	locationType: EventLocationType;
	eventCity?: string;
	isRealEvent?: boolean;
	eventAddress?: string;

	// Coordinates
	coordinateLatitude?: number;
	coordinateLongitude?: number;
	eventCapacity?: number;
	eventPrice?: number;
	eventCurrency?: string;
	eventStatus?: EventStatus;
	eventCategories: EventCategory[];
	eventTags: string[];

	// ===== First Occurrence Template =====
	eventStartAt: Date;
	eventEndAt: Date;

	// ===== References =====
	groupId?: string;
}

export interface EventRecurrenceUpdateInput {
	_id: string;
	updateAllFuture?: boolean;

	// ===== Recurrence Rules =====
	recurrenceType?: RecurrenceType;
	recurrenceInterval?: number;
	recurrenceDaysOfWeek?: number[];
	recurrenceDayOfMonth?: number;
	recurrenceEndDate?: Date;

	// ===== Template Fields =====
	eventName?: string;
	eventDesc?: string;
	eventImages?: string[];
	locationType?: EventLocationType;
	eventCity?: string;
	eventAddress?: string;

	// Coordinates
	coordinateLatitude?: number;
	coordinateLongitude?: number;

	eventCapacity?: number;
	eventPrice?: number;
	eventCurrency?: string;
	eventStatus?: EventStatus;
	eventCategories?: EventCategory[];
	eventTags?: string[];
	eventStartAt?: Date;
	eventEndAt?: Date;
	groupId?: string;
	isRealEvent?: boolean;
	isActive?: boolean;
}
