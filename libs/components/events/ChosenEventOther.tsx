import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/libs/components/ui/card';
import { Member } from '@/libs/types/member/member';
import { Group } from '@/libs/types/group/group';
import { Event } from '@/libs/types/event/event';
import SmallEventCard from '../common/SmallEventCard';
import { Users, Calendar } from 'lucide-react';

interface ChosenEventOtherProps {
	organizer: Member;
	group: Group;
	similarEvents: Event[];
}

const ChosenEventOther = ({ organizer, group, similarEvents }: ChosenEventOtherProps) => {
	return (
		<div className="space-y-8">
			{/* Owner's Info */}
			<Link
				href={`/organizer/${organizer?._id}`}
				className="block group hover:scale-105 transition-transform duration-300"
			>
				<Card className="p-8 bg-card hover:bg-secondary/90 transition-all duration-300 shadow-sm hover:shadow-md border border-border/50">
					<h2 className="text-2xl font-semibold mb-6 text-card-foreground flex items-center gap-2">
						<Users className="w-5 h-5 text-card-foreground" />
						Organizer
					</h2>
					<div className="flex items-center space-x-6">
						<div className="flex-shrink-0">
							<div className="w-20 h-20 rounded-xl overflow-hidden relative">
								<Image
									src={organizer?.memberImage || '/images/default-avatar.jpg'}
									alt={organizer?.memberFullName || 'Organizer avatar'}
									fill
									className="object-cover group-hover:scale-105 transition-transform duration-200"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
							</div>
						</div>
						<div className="space-y-2">
							<h3 className="text-xl font-semibold text-card-foreground group-hover:text-card-foreground transition-colors duration-200">
								{organizer?.memberFullName ?? 'No Name'}
							</h3>
							<p className="text-base text-card-foreground leading-relaxed group-hover:text-card-foreground/80 transition-colors duration-200">
								{organizer?.memberDesc ?? 'No Description'}
							</p>
						</div>
					</div>
				</Card>
			</Link>

			{/* Hosting Group */}
			<Link href={`/groups/${group._id}`} className="block group hover:scale-105 transition-transform duration-300">
				<Card className="p-8 bg-card hover:bg-secondary/90 transition-all duration-300 shadow-sm hover:shadow-md border border-border/50">
					<h2 className="text-2xl font-semibold mb-6 text-card-foreground flex items-center gap-2">
						<Calendar className="w-5 h-5 text-card-foreground" />
						Hosting Group
					</h2>
					<div className="flex items-center space-x-6">
						<div className="flex-shrink-0">
							<div className="w-20 h-20 rounded-xl overflow-hidden relative">
								<Image
									src={group.groupImage}
									alt={group.groupName}
									fill
									className="object-cover group-hover:scale-105 transition-transform duration-200"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
							</div>
						</div>
						<div className="space-y-2">
							<h3 className="text-xl font-semibold text-card-foreground group-hover:text-card-foreground transition-colors duration-200">
								{group.groupName}
							</h3>
							<p className="text-base text-card-foreground leading-relaxed group-hover:text-card-foreground/80 transition-colors duration-200">
								{group.groupDesc}
							</p>
							<div className="flex items-center space-x-6 pt-2">
								<div className="flex items-center gap-2 text-sm text-card-foreground">
									<Users className="w-4 h-4 text-card-foreground/70" />
									<span>{group.memberCount} members</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-card-foreground">
									<Calendar className="w-4 h-4 text-card-foreground/70" />
									<span>{group.eventsCount} events</span>
								</div>
							</div>
						</div>
					</div>
				</Card>
			</Link>

			{/* Similar Events */}
			<Card className="p-6 bg-card hover:bg-secondary/90 transition-colors duration-200">
				<h2 className="text-2xl font-semibold mb-6 text-card-foreground flex items-center gap-2">Similar Events</h2>
				<div className="space-y-4">
					{similarEvents.map((similarEvent) => (
						<SmallEventCard key={similarEvent._id} event={similarEvent} />
					))}
				</div>
			</Card>
		</div>
	);
};

export default ChosenEventOther;
