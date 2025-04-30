import { Ticket } from '@/libs/types/ticket/ticket';
import { TicketStatus } from '@/libs/enums/ticket.enum';
import { Calendar } from 'lucide-react';
import { Button } from '@/libs/components/ui/button';

interface ProfileTicketsProps {
	tickets: Ticket[];
}

type TicketAction = TicketStatus | 'DELETE';

export const ProfileTickets = ({ tickets }: ProfileTicketsProps) => {
	const getStatusColor = (status: TicketStatus) => {
		switch (status) {
			case TicketStatus.PURCHASED:
				return 'bg-green-100 text-green-800';
			case TicketStatus.CANCELLED:
				return 'bg-red-100 text-red-800';
			case TicketStatus.USED:
				return 'bg-gray-100 text-gray-800';
			case TicketStatus.EXPIRED:
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getAvailableActions = (status: TicketStatus) => {
		switch (status) {
			case TicketStatus.PURCHASED:
				return [
					{ label: 'Cancel', action: TicketStatus.CANCELLED as TicketAction },
					{ label: 'Mark as Expired', action: TicketStatus.EXPIRED as TicketAction },
				];
			case TicketStatus.CANCELLED:
			case TicketStatus.EXPIRED:
				return [{ label: 'Delete', action: 'DELETE' as TicketAction }];
			default:
				return [];
		}
	};

	const handleStatusChange = (ticketId: string, newStatus: TicketAction) => {
		// TODO: Implement API call to update ticket status
		console.log(`Changing ticket ${ticketId} to ${newStatus}`);
	};

	return (
		<div className="bg-white rounded-lg shadow">
			<div className="px-6 py-4 border-b border-gray-200">
				<h2 className="text-lg font-medium text-gray-900">My Tickets</h2>
			</div>
			<div className="divide-y divide-gray-200">
				{tickets.length === 0 ? (
					<div className="px-6 py-4 text-center text-gray-500">No tickets found</div>
				) : (
					tickets.map((ticket) => (
						<div key={ticket._id} className="px-6 py-4">
							<div className="flex items-center">
								<div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
									<Calendar className="h-6 w-6 text-gray-600" />
								</div>
								<div className="ml-4 flex-1">
									<h3 className="text-sm font-medium text-gray-900">{ticket.event?.eventName || 'Event'}</h3>
									<p className="text-sm text-gray-500">
										{ticket.event?.eventDate ? new Date(ticket.event.eventDate).toLocaleDateString() : 'No date'}
									</p>
									<div className="mt-2 flex items-center gap-2">
										<span
											className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.ticketStatus)}`}
										>
											{ticket.ticketStatus}
										</span>
										<span className="text-sm font-medium text-gray-900">${ticket.ticketPrice}</span>
									</div>
									<div className="mt-2 flex gap-2">
										{getAvailableActions(ticket.ticketStatus).map((action) => (
											<Button
												key={action.label}
												variant="outline"
												size="sm"
												onClick={() => handleStatusChange(ticket._id, action.action)}
											>
												{action.label}
											</Button>
										))}
									</div>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};
