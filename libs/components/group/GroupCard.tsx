import { Users, Calendar, ChevronRight, Check, Hash } from 'lucide-react';
import { Button } from '@/libs/components/ui/button';
import Link from 'next/link';
import { Card } from '@/libs/components/ui/card';
import { Badge } from '@/libs/components/ui/badge';
import { Group } from '@/libs/types/group/group';
import Image from 'next/image';

interface GroupCardProps {
	group: Group;
	onJoin: (groupId: string) => void;
	isJoined: boolean;
}

const formatNumber = (num: number): string => {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + 'M';
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1) + 'K';
	}
	return num.toString();
};

export const GroupCard = ({ group, onJoin, isJoined }: GroupCardProps) => {
	return (
		<div className="group">
			<Card className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-sm border border-border/50 overflow-hidden hover:shadow-md transition-all duration-300 group-hover:border-primary/50">
				<div className="relative h-48 w-full overflow-hidden rounded-t-lg">
					<Link href={`/groups/${group._id}`}>
						<Image
							src={group.groupImage}
							alt={group.groupName}
							fill
							className="object-cover transition-transform duration-300 hover:scale-105"
						/>
					</Link>
					{group.groupCategories && group.groupCategories.length > 0 && (
						<div className="absolute top-2 right-2">
							<Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
								{group.groupCategories[0]}
							</Badge>
						</div>
					)}
				</div>
				<div className="p-6">
					<div className="flex justify-between items-start mb-3 h-[2.5rem]">
						<h3 className="text-lg font-medium text-foreground line-clamp-1">{group.groupName}</h3>
					</div>
					<div className="flex flex-wrap gap-1.5 mb-3">
						{group.groupCategories.map((category, index) => (
							<Badge
								key={index}
								variant="outline"
								className="bg-white/90 backdrop-blur-sm text-[#4A4A4A] hover:bg-[#F8F8F8] transition-colors duration-200 text-xs px-2 py-1"
							>
								<Hash className="w-3 h-3 mr-1" />
								{category}
							</Badge>
						))}
					</div>
					<div className="h-[3.5rem] overflow-hidden">
						<p className="text-muted-foreground text-sm line-clamp-2">{group.groupDesc}</p>
					</div>
					<div className="space-y-2 mt-4">
						<div className="flex items-center text-sm text-muted-foreground">
							<Users className="w-4 h-4 mr-2" />
							{formatNumber(group.memberCount)} members
						</div>
						<div className="flex items-center text-sm text-muted-foreground">
							<Calendar className="w-4 h-4 mr-2" />
							{formatNumber(group.groupViews)} views
						</div>
					</div>
					<div className="mt-6 border-t border-border/50 pt-4 flex items-center justify-between">
						<Button
							onClick={() => onJoin(group._id)}
							className={`transition-all duration-200 ${
								isJoined
									? 'bg-[#00A862] hover:bg-[#008F54] text-white cursor-default'
									: 'bg-[#2D2D2D] hover:bg-[#1A1A1A] text-white hover:scale-[1.02]'
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
						<Link
							href={group.groupLink}
							className="text-[#2D2D2D] hover:text-[#1A1A1A] transition-colors duration-200 flex items-center gap-1.5 text-sm font-medium"
						>
							View details
							<ChevronRight className="w-4 h-4" />
						</Link>
					</div>
				</div>
			</Card>
		</div>
	);
};
