import Link from 'next/link';
import { MapPin, Calendar, Heart, Eye } from 'lucide-react';
import { Button } from '@/libs/components/ui/button';

interface Event {
	id: string;
	title: string;
	image: string;
	date: string;
	location: string;
	type: string;
	views: number;
}

interface EventCardProps {
	event: Event;
	onLike: (eventId: string) => void;
	isLiked: boolean;
}

export const EventCard = ({ event, onLike, isLiked }: EventCardProps) => {
	return (
		<Link
			href={`/events/${event.id}`}
			className="block group hover:bg-[#F5F5F5] rounded-xl p-2 transition-all duration-200 shadow-sm hover:shadow-md"
		>
			<div className="flex gap-4">
				<div className="flex-shrink-0">
					<div className="w-20 h-20 rounded-xl overflow-hidden">
						<img
							src={event.image}
							alt={event.title}
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
						/>
					</div>
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between">
						<h4 className="text-body font-semibold text-[#111111] group-hover:text-[#E60023] line-clamp-1">
							{event.title}
						</h4>
						<Button
							variant="ghost"
							size="sm"
							onClick={(e) => {
								e.preventDefault();
								onLike(event.id);
							}}
							className="text-gray-500 hover:text-[#E60023] transition-colors duration-200"
						>
							<Heart
								className={`h-4 w-4 transition-all duration-200 ${isLiked ? 'fill-[#E60023] text-[#E60023]' : ''}`}
							/>
						</Button>
					</div>
					<div className="mt-2 flex items-center gap-4 text-caption text-[#6E6E6E]">
						<div className="flex items-center">
							<Calendar className="w-3 h-3 mr-1" />
							{new Date(event.date).toLocaleDateString()}
						</div>
						<div className="flex items-center">
							<MapPin className="w-3 h-3 mr-1" />
							<span className="line-clamp-1">{event.location}</span>
						</div>
						<div className="flex items-center ml-auto">
							<Eye className="w-3 h-3 mr-1" />
							{event.views.toLocaleString()}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};
