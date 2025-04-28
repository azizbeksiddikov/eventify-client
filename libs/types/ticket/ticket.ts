import { TicketStatus } from '../../enums/ticket.enum';
import { TotalCounter } from '../member/member';
import { Event } from '../event/event';

export interface Ticket {
	_id: string;
	eventId: string;
	memberId: string;
	ticketStatus: TicketStatus;
	ticketPrice: number;
	createdAt: Date;
	updatedAt: Date;
	event?: Event;
}

export interface Tickets {
	list: Ticket[];
	metaCounter: TotalCounter[];
}
