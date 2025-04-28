import { TicketStatus } from '../../enums/ticket.enum';

export interface UpdateTicketInput {
	_id: string;
	eventId?: string;
	memberId?: string;
	ticketPrice?: number;
	ticketStatus?: TicketStatus;
}
