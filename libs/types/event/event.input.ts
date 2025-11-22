import { Direction } from "@/libs/enums/common.enum";
import { EventStatus, EventCategory, EventType, RecurrenceType } from "@/libs/enums/event.enum";

// ============== Event Creation Input ==============
export interface EventInput {
	eventType?: EventType;

	// ===== Basic Information =====
	eventName: string;
	eventDesc: string;
	eventImages: string[];

	// ===== Event Timestamps =====
	eventStartAt: Date;
	eventEndAt: Date;

	// ===== Event Location =====
	eventCity: string;
	eventAddress: string;

	// ===== Event Capacity and Price =====
	eventCapacity?: number;
	eventPrice?: number;
	groupId?: string;

	// ===== Event Status and Categories =====
	eventStatus?: EventStatus;
	eventCategories: EventCategory[];
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
	eventCity: string;
	eventAddress: string;
	eventCapacity?: number;
	eventPrice?: number;
	eventStatus?: EventStatus;
	eventCategories: EventCategory[];

	// ===== First Occurrence Template =====
	eventStartAt: Date;
	eventEndAt: Date;

	// ===== References =====
	groupId?: string;
}

export interface EventRecurrenceUpdateInput {
	_id: string;
	updateAllFuture?: boolean;
	recurrenceType?: RecurrenceType;
	recurrenceInterval?: number;
	recurrenceDaysOfWeek?: number[];
	recurrenceDayOfMonth?: number;
	recurrenceEndDate?: Date;

	// ===== Template Fields =====
	eventName?: string;
	eventDesc?: string;
	eventImages?: string[];
	eventCity?: string;
	eventAddress?: string;
	eventCapacity?: number;
	eventPrice?: number;
	eventStatus?: EventStatus;
	eventCategories?: EventCategory[];
	eventStartAt?: Date;
	eventEndAt?: Date;
	groupId?: string;
	isActive?: boolean; // todo: make it false when deleted or cancelled
}
