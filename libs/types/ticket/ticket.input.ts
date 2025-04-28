import { TicketStatus } from '../../enums/ticket.enum';
import { Direction } from '../../enums/common.enum';

export interface TicketInput {
	eventId: string;
	memberId: string;
	ticketPrice: number;
	ticketStatus: TicketStatus;
}

export interface TISearch {
	ticketStatus?: TicketStatus;
}

export interface TicketInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: TISearch;
}
