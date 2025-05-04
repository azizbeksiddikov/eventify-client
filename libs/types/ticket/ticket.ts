import { TicketStatus } from '@/libs/enums/ticket.enum';
import { TotalCounter } from '@/libs/types/member/member';
import { Event } from '@/libs/types/event/event';

export interface Ticket {
	_id: string;
	memberId: string;
	ticketStatus: TicketStatus;
	ticketPrice: number;
	ticketQuantity: number;
	totalPrice: number;
	createdAt: Date;
	updatedAt: Date;
	event?: Event;
}

export interface Tickets {
	list: Ticket[];
	metaCounter: TotalCounter[];
}
