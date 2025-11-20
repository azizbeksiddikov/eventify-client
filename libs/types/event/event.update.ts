import { EventStatus, EventCategory } from '@/libs/enums/event.enum';

export interface EventUpdateInput {
	// ===== Identification =====
	_id: string;

	// ===== Recurring Event Update Option =====
	updateAllFuture?: boolean;

	// ===== Basic Information =====
	eventName?: string;
	eventDesc?: string;
	eventImages?: string[];

	// ===== Event Timestamps =====
	eventStartAt?: Date;
	eventEndAt?: Date;

	eventCity?: string;
	eventAddress?: string;
	eventCapacity?: number;
	eventPrice?: number;

	// ===== Type and Status =====
	eventStatus?: EventStatus;
	eventCategories?: EventCategory[];
}
