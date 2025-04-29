import { Trash2 } from 'lucide-react';
import { Ticket } from '@/libs/types/ticket/ticket';
import { Button } from '@/components/ui/button';
import { TicketStatus } from '@/libs/enums/ticket.enum';

interface AdminTicketCardProps {
	ticket: Ticket;
	onDelete: (ticketId: string) => void;
}

const AdminTicketCard = ({ ticket, onDelete }: AdminTicketCardProps) => {
	const handleDelete = () => {
		if (window.confirm('Are you sure you want to delete this ticket?')) {
			onDelete(ticket._id);
		}
	};

	const getStatusColor = (status: TicketStatus) => {
		switch (status) {
			case TicketStatus.PURCHASED:
				return 'bg-blue-100 text-blue-800';
			case TicketStatus.USED:
				return 'bg-green-100 text-green-800';
			case TicketStatus.CANCELLED:
				return 'bg-red-100 text-red-800';
			case TicketStatus.EXPIRED:
				return 'bg-gray-100 text-gray-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-4">
			<div className="flex justify-between items-start">
				<div className="flex items-center gap-3">
					<div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
						<span className="text-gray-400 text-lg">{ticket._id.charAt(0)}</span>
					</div>
					<div>
						<h3 className="font-semibold">Ticket #{ticket._id.slice(0, 8)}</h3>
						<p className="text-sm text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</p>
					</div>
				</div>
				<Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-600 hover:text-red-700">
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>
			<div className="mt-4 grid grid-cols-2 gap-2 text-sm">
				<div>
					<span className="text-gray-500">Status:</span>
					<span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.ticketStatus)}`}>
						{ticket.ticketStatus}
					</span>
				</div>
				<div>
					<span className="text-gray-500">Event:</span>
					<span className="ml-2">{ticket.eventId}</span>
				</div>
				<div>
					<span className="text-gray-500">Price:</span>
					<span className="ml-2">${ticket.ticketPrice}</span>
				</div>
				<div>
					<span className="text-gray-500">Member:</span>
					<span className="ml-2">{ticket.memberId}</span>
				</div>
				{ticket.event && (
					<>
						<div>
							<span className="text-gray-500">Event Name:</span>
							<span className="ml-2">{ticket.event.eventName}</span>
						</div>
						<div>
							<span className="text-gray-500">Event Date:</span>
							<span className="ml-2">{new Date(ticket.event.eventDate).toLocaleDateString()}</span>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default AdminTicketCard;
