import { Users, Calendar, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/libs/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/libs/components/ui/card';

interface Group {
	id: string;
	name: string;
	description: string;
	image: string;
	category: string;
	organizerId: string;
	membersCount: number;
	eventsCount: number;
	createdAt: Date;
	updatedAt: Date;
}

interface GroupCardProps {
	group: Group;
	onJoin: (groupId: string) => void;
	isJoined: boolean;
}

export const GroupCard = ({ group, onJoin, isJoined }: GroupCardProps) => {
	return (
		<Card className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 animate-slideIn bg-gradient-to-br from-white to-[#F8F8F8]">
			<div className="relative h-40">
				<img
					src={group.image}
					alt={group.name}
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
			</div>
			<CardHeader className="p-4 pb-2">
				<CardTitle className="text-lg font-semibold text-[#2D2D2D] group-hover:text-[#1A1A1A] transition-colors duration-200">
					{group.name}
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4 pt-0">
				<p className="text-sm text-[#4A4A4A] mb-4 line-clamp-2">{group.description}</p>
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between text-xs text-[#4A4A4A]">
						<div className="flex items-center gap-4">
							<div className="flex items-center">
								<Users className="w-3 h-3 mr-1" />
								{group.membersCount.toLocaleString()} members
							</div>
							<div className="flex items-center">
								<Calendar className="w-3 h-3 mr-1" />
								{group.eventsCount} events
							</div>
						</div>
						<Link
							href={`/groups/${group.id}`}
							className="text-[#2D2D2D] hover:text-[#1A1A1A] transition-colors duration-200 flex items-center gap-1"
						>
							View details
							<ChevronRight className="w-3 h-3" />
						</Link>
					</div>
					<Button
						onClick={() => onJoin(group.id)}
						className={`w-full transition-colors duration-200 ${
							isJoined
								? 'bg-[#00A862] hover:bg-[#008F54] text-white cursor-default'
								: 'bg-[#2D2D2D] hover:bg-[#1A1A1A] text-white'
						}`}
						disabled={isJoined}
					>
						{isJoined ? (
							<div className="flex items-center gap-2">
								<Check className="w-4 h-4" />
								<span>Joined</span>
							</div>
						) : (
							'Join Group'
						)}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
