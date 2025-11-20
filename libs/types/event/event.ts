import { EventStatus, EventCategory, EventType, RecurrenceType } from '@/libs/enums/event.enum';
import { Member, TotalCounter } from '@/libs/types/member/member';
import { Group } from '@/libs/types/group/group';
import { MeLiked } from '@/libs/types/like/like';

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

	// ===== Event Location =====
	eventCity: string;
	eventAddress: string;

	// ===== Event Capacity and Price =====
	eventCapacity?: number;
	eventPrice?: number;

	// ===== Type and Status =====
	eventStatus: EventStatus;
	eventCategories: EventCategory[];

	// ===== References =====
	groupId?: string;
	memberId: string;

	// ===== Origin =====
	origin: string;

	// ===== Statistics =====
	attendeeCount: number;
	eventLikes: number;
	eventViews: number;

	// ===== Timestamps =====
	createdAt: Date;
	updatedAt: Date;

	// ===== Aggregated Fields =====
	memberData?: Member;
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
	eventAddress: string;
	eventCity: string;
	eventCapacity?: number;
	eventPrice: number;
	eventCategories: EventCategory[];
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

	// ===== Timestamps =====
	createdAt: Date;
	updatedAt: Date;
}
