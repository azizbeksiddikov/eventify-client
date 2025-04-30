import Link from 'next/link';
import { Calendar, ArrowRight, MapPin, Heart } from 'lucide-react';
import { Button } from '@/libs/components/ui/button';
import { useState } from 'react';

interface Organizer {
	id: string;
	name: string;
	image: string;
	eventsCount: number;
	location: string;
}

const TopOrganizers = () => {
	const [likedOrganizers, setLikedOrganizers] = useState<Set<string>>(new Set());

	const handleLikeOrganizer = (organizerId: string) => {
		setLikedOrganizers((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(organizerId)) {
				newSet.delete(organizerId);
			} else {
				newSet.add(organizerId);
			}
			return newSet;
		});
	};

	const organizers: Organizer[] = [
		{
			id: '1',
			name: 'Sarah Johnson',
			image: 'https://picsum.photos/seed/organizer1/400/400',
			eventsCount: 156,
			location: 'New York, NY',
		},
		{
			id: '2',
			name: 'Michael Chen',
			image: 'https://picsum.photos/seed/organizer2/400/400',
			eventsCount: 89,
			location: 'San Francisco, CA',
		},
		{
			id: '3',
			name: 'Emma Rodriguez',
			image: 'https://picsum.photos/seed/organizer3/400/400',
			eventsCount: 112,
			location: 'Miami, FL',
		},
		{
			id: '4',
			name: 'David Wilson',
			image: 'https://picsum.photos/seed/organizer4/400/400',
			eventsCount: 78,
			location: 'Chicago, IL',
		},
	];

	return (
		<section className=" animate-fadeIn">
			<div className="flex items-center justify-between">
				<h2 className="text-h1 font-bold text-[#111111]">Top Organizers</h2>
				<Link
					href="/organizers"
					className="text-[#E60023] hover:text-[#CC0000] transition-colors duration-200 flex items-center gap-1 text-body"
				>
					View All Organizers
					<ArrowRight className="w-4 h-4" />
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{organizers.map((organizer) => (
					<Link
						key={organizer.id}
						href={`/organizers/${organizer.id}`}
						className="block group hover:bg-[#F5F5F5] rounded-xl p-2 transition-all duration-200 shadow-sm hover:shadow-md"
					>
						<div className="flex flex-col gap-3">
							<div className="relative aspect-square rounded-xl overflow-hidden">
								<img
									src={organizer.image}
									alt={organizer.name}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
								/>
							</div>
							<div className="flex flex-col gap-2">
								<div className="flex items-start justify-between">
									<h3 className="text-body font-semibold text-[#111111] group-hover:text-[#E60023] line-clamp-1">
										{organizer.name}
									</h3>
									<Button
										variant="ghost"
										size="sm"
										onClick={(e) => {
											e.preventDefault();
											handleLikeOrganizer(organizer.id);
										}}
										className="text-gray-500 hover:text-[#E60023] transition-colors duration-200"
									>
										<Heart
											className={`h-4 w-4 transition-all duration-200 ${
												likedOrganizers.has(organizer.id) ? 'fill-[#E60023] text-[#E60023]' : ''
											}`}
										/>
									</Button>
								</div>
								<div className="flex items-center gap-2 text-caption text-[#6E6E6E]">
									<MapPin className="w-3 h-3" />
									<span className="line-clamp-1">{organizer.location}</span>
								</div>
								<div className="flex items-center gap-2 text-caption text-[#6E6E6E]">
									<Calendar className="w-3 h-3" />
									<span>{organizer.eventsCount} events</span>
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
};

export default TopOrganizers;
