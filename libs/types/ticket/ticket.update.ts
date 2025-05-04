import { TicketStatus } from '@/libs/enums/ticket.enum';

export interface UpdateTicketInput {
	_id: string;
	ticketStatus: TicketStatus;
}
