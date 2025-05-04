import { TicketStatus } from '@/libs/enums/ticket.enum';
import { Direction } from '@/libs/enums/common.enum';

export interface TicketInput {
	eventId: string;
	ticketPrice: number;
	ticketQuantity: number;
	totalPrice: number;
}

export interface TISearch {
	ticketStatus?: TicketStatus;
	eventId?: string;
}

export interface TicketInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: TISearch;
}
