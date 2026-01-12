import { EventStatus, EventCategory, EventType, RecurrenceType, EventLocationType } from "@/libs/enums/event.enum";
import { Member, TotalCounter } from "@/libs/types/member/member";
import { Group } from "@/libs/types/group/group";
import { MeLiked } from "@/libs/types/like/like";

export interface Event {
	// ===== Basic Information =====
	_id: string;
	eventType: EventType;
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
	eventPrice: number;
	eventCurrency?: string;

	// ===== Type and Status =====
	eventStatus: EventStatus;
	eventCategories: EventCategory[];
	eventTags: string[];

	// ===== Internal References =====
	groupId?: string;
	memberId?: string;

	// ===== External Source Information =====
	origin: string; // 'internal' | 'meetup.com' | 'luma.com' | 'eventbrite.com', etc.
	externalId?: string; // Original event ID from external platform
	externalUrl?: string; // Link to original event page

	isRealEvent: boolean;
	attendeeCount: number;
	eventLikes: number;
	eventViews: number;
	createdAt: Date;
	updatedAt: Date;

	// ===== Aggregated Fields =====
	memberData?: Member | null;
	hostingGroup?: Group;
	meLiked?: MeLiked[];
	similarEvents?: Event[];
}

export interface Events {
	list: Event[];
	metaCounter: TotalCounter[];
}

export interface CategoryEvents {
	category: EventCategory;
	events: Event[];
}

export interface EventRecurrence {
	// ===== ID =====
	_id: string;

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
	eventAddress?: string;

	// Coordinates
	coordinateLatitude?: number;
	coordinateLongitude?: number;
	eventCapacity?: number;
	eventPrice: number;
	eventCurrency?: string;
	eventCategories: EventCategory[];
	eventTags: string[];
	eventStatus: EventStatus;

	// ===== First Occurrence Template =====
	eventStartAt: Date;
	eventEndAt: Date;

	// ===== Ownership =====
	groupId?: string;
	memberId: string;

	// ===== Origin =====
	origin: string;

	// ===== Status =====
	isActive: boolean;
	isRealEvent: boolean;

	// ===== Timestamps =====
	createdAt: Date;
	updatedAt: Date;
}
