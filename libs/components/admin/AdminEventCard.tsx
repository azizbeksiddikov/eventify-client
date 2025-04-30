import { Users, Eye, Heart, Trash2 } from 'lucide-react';
import { Event } from '@/libs/types/event/event';
import { EventStatus } from '@/libs/enums/event.enum';
import { Button } from '@/libs/components/ui/button';

interface AdminEventCardProps {
	event: Event;
	onDelete: (eventId: string) => void;
}

const AdminEventCard = ({ event, onDelete }: AdminEventCardProps) => {
	const handleDelete = () => {
		if (window.confirm('Are you sure you want to delete this event?')) {
			onDelete(event._id);
		}
	};

	const getStatusColor = (status: EventStatus) => {
		switch (status) {
			case EventStatus.UPCOMING:
				return 'bg-blue-100 text-blue-800';
			case EventStatus.ONGOING:
				return 'bg-green-100 text-green-800';
			case EventStatus.COMPLETED:
				return 'bg-gray-100 text-gray-800';
			case EventStatus.CANCELLED:
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
			<div className="flex justify-between items-start">
				<div className="flex items-center gap-3">
					{event.eventImage ? (
						<img src={event.eventImage} alt={event.eventName} className="w-12 h-12 rounded-lg object-cover" />
					) : (
						<div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
							<span className="text-gray-400 text-lg">{event.eventName.charAt(0)}</span>
						</div>
					)}
					<div>
						<h3 className="font-semibold">{event.eventName}</h3>
						<p className="text-sm text-gray-500">
							{new Date(event.eventDate).toLocaleDateString()} {event.eventStartTime} - {event.eventEndTime}
						</p>
					</div>
				</div>
				<Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-600 hover:text-red-700">
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>

			{/* Event Info */}
			<div className="space-y-3 mt-4">
				<div className="flex items-center justify-between">
					<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.eventStatus)}`}>
						{event.eventStatus}
					</span>
				</div>

				<p className="text-sm text-gray-600 line-clamp-2">{event.eventDesc}</p>

				{/* Event Details */}
				<div className="space-y-2">
					<div className="flex items-center text-sm text-gray-500">
						<Users className="h-4 w-4 mr-2" />
						<span>
							{event.attendeeCount} / {event.eventCapacity} attendees
						</span>
					</div>

					<div className="flex items-center justify-between text-sm text-gray-500">
						<div className="flex items-center">
							<Heart className="h-4 w-4 mr-2" />
							<span>{event.eventLikes} likes</span>
						</div>
						<div className="flex items-center">
							<Eye className="h-4 w-4 mr-2" />
							<span>{event.eventViews} views</span>
						</div>
					</div>
				</div>

				{/* Price */}
				<div className="pt-2">
					<span className="text-lg font-semibold text-gray-900">${event.eventPrice}</span>
				</div>
			</div>
		</div>
	);
};

export default AdminEventCard;
