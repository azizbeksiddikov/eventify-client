import { EventStatus, EventCategory, EventLocationType } from "@/libs/enums/event.enum";

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

	// ===== Location Details =====
	locationType?: EventLocationType;

	// ===== Event Details =====
	eventCity?: string;
	eventAddress?: string;

	// Coordinates
	coordinateLatitude?: number;
	coordinateLongitude?: number;
	eventCapacity?: number;
	eventPrice?: number;
	eventCurrency?: string;

	// ===== Type and Status =====
	eventStatus?: EventStatus;
	eventCategories?: EventCategory[];
	eventTags?: string[];

	// ===== External Source Information =====
	externalId?: string;
	externalUrl?: string;
	isRealEvent?: boolean;
}
