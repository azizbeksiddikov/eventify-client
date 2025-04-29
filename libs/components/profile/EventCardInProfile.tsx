import { Event } from '@/libs/types/event/event';
import { EventStatus } from '@/libs/enums/event.enum';
import { Calendar, MapPin, Users } from 'lucide-react';

interface EventCardInProfileProps {
	event: Event;
}

export const EventCardInProfile = ({ event }: EventCardInProfileProps) => {
	return (
		<div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4">
			<div className="flex items-start space-x-4">
				<img
					src={event.eventImage || '/default-event.jpg'}
					alt={event.eventName}
					className="w-16 h-16 rounded-lg object-cover"
				/>
				<div className="flex-1">
					<h3 className="font-medium text-gray-900">{event.eventName}</h3>
					<p className="text-sm text-gray-500 mt-1">{event.eventDesc}</p>
					<div className="flex items-center space-x-4 mt-2">
						<div className="flex items-center text-sm text-gray-500">
							<Calendar className="h-4 w-4 mr-1" />
							{new Date(event.eventDate).toLocaleDateString()}
						</div>
						<div className="flex items-center text-sm text-gray-500">
							<MapPin className="h-4 w-4 mr-1" />
							{event.eventAddress}
						</div>
						<div className="flex items-center text-sm text-gray-500">
							<Users className="h-4 w-4 mr-1" />
							{event.attendeeCount} attendees
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
