import { Users, Calendar, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/libs/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardTitle } from '@/libs/components/ui/card';
import { Group } from '@/libs/types/group/group';

interface GroupCardProps {
	group: Group;
	onJoin: (groupId: string) => void;
	isJoined: boolean;
}

export const GroupCard = ({ group, onJoin, isJoined }: GroupCardProps) => {
	return (
		<Card className="group relative overflow-hidden rounded-xl border-2 border-border/50 hover:border-primary/50 transition-all duration-300 h-[420px] flex flex-col shadow-sm hover:shadow-md">
			<div className="relative h-48 flex-shrink-0 overflow-hidden">
				<img
					src={group.groupImage}
					alt={group.groupName}
					className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
				<div className="absolute bottom-4 left-4 right-4">
					<CardTitle className="text-xl font-bold text-foreground drop-shadow-lg">{group.groupName}</CardTitle>
				</div>
			</div>
			<CardContent className="p-6 flex flex-col h-[calc(420px-12rem)]">
				<div className="flex flex-col h-full">
					<div className="flex-grow-0">
						<p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-[2.5rem]">{group.groupDesc}</p>
					</div>
					<div className="flex items-center justify-between text-sm mt-auto">
						<div className="flex items-center gap-6">
							<div className="flex items-center text-muted-foreground">
								<Users className="w-4 h-4 mr-2" />
								{group.memberCount.toLocaleString()} members
							</div>
							<div className="flex items-center text-muted-foreground">
								<Calendar className="w-4 h-4 mr-2" />
								{group.eventsCount} events
							</div>
						</div>
						<Link
							href={`/groups/${group._id}`}
							className="text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-1 text-sm font-medium"
						>
							View details
							<ChevronRight className="w-4 h-4" />
						</Link>
					</div>
					<Button
						onClick={() => onJoin(group._id)}
						className={`w-full mt-4 transition-all duration-200 ${
							isJoined
								? 'bg-primary/10 text-primary hover:bg-primary/20 cursor-default'
								: 'bg-primary text-primary-foreground hover:bg-primary/90'
						}`}
						disabled={isJoined}
						variant={isJoined ? 'ghost' : 'default'}
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
