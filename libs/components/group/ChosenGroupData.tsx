import { Button } from '../ui/button';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { Heart, Eye, Calendar, Users, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { Group } from '@/libs/types/group/group';

interface ChosenGroupDataProps {
	group: Group;
}

const ChosenGroupData = ({ group }: ChosenGroupDataProps) => {
	const [isLiked, setIsLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(group.groupLikes);
	const [isJoined, setIsJoined] = useState(false);

	const toggleLike = async () => {
		try {
			setIsLiked(!isLiked);
			setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
			// TODO: Implement like/unlike API call
		} catch (error) {
			console.error('Error updating like:', error);
			setIsLiked(!isLiked);
			setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
		}
	};

	const toggleJoin = async () => {
		try {
			setIsJoined(!isJoined);
			// TODO: Implement join group API call
		} catch (error) {
			console.error('Error joining group:', error);
			setIsJoined(!isJoined);
		}
	};

	return (
		<div className="lg:col-span-2">
			<div className="bg-card rounded-2xl shadow-sm  transition-all duration-300 overflow-hidden border border-border/50">
				<div className="relative h-[400px] w-full group">
					<Image
						src={group.groupImage}
						alt={group.groupName}
						fill
						className="object-cover  transition-transform duration-300"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0  transition-opacity duration-300" />
				</div>
				<div className="p-8">
					<div className="flex justify-between items-start mb-8">
						<div>
							<h1 className="text-4xl font-semibold text-card-foreground tracking-tight mb-2">{group.groupName}</h1>
							<div className="flex items-center space-x-2">
								{group.groupCategories.map((category) => (
									<Badge
										key={category}
										className="bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 transition-colors duration-200"
									>
										#{category}
									</Badge>
								))}
							</div>
						</div>
					</div>
					<div className="flex items-center space-x-6 mb-8">
						<button
							onClick={toggleLike}
							className={`flex items-center space-x-2 transition-all duration-200 group ${
								isLiked ? 'text-red-500 hover:text-red-600' : 'text-card-foreground/70 hover:text-primary'
							}`}
						>
							<Heart
								className={`h-5 w-5 transition-all duration-200 ${
									isLiked ? 'fill-red-500 text-red-500' : 'text-card-foreground/70 group-hover:text-primary'
								}`}
							/>
							<span className="text-sm">{likesCount} likes</span>
						</button>
						<div className="flex items-center space-x-2 text-card-foreground/70">
							<Eye className="h-5 w-5" />
							<span className="text-sm">{group.groupViews} views</span>
						</div>
						<div className="flex items-center space-x-2 text-card-foreground/70">
							<Users className="h-5 w-5" />
							<span className="text-sm">{group.memberCount} members</span>
						</div>
						<div className="flex items-center space-x-2 text-card-foreground/70">
							<Calendar className="h-5 w-5" />
							<span className="text-sm">{group.eventsCount} events</span>
						</div>
					</div>
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-semibold mb-3 text-card-foreground flex items-center gap-2">
								<Bookmark className="w-5 h-5 text-card-foreground/70" />
								About
							</h3>
							<p className="text-card-foreground/80 leading-relaxed whitespace-pre-line">{group.groupDesc}</p>
						</div>
						<div className="flex items-center space-x-3 text-card-foreground/70">
							<Calendar className="h-5 w-5" />
							<span>Created {group.createdAt.toLocaleDateString()}</span>
						</div>
					</div>
					<div className="mt-8 border-t border-border/50 pt-6">
						<Button
							onClick={toggleJoin}
							size="lg"
							className={`w-full transition-all duration-200 ${
								isJoined
									? 'bg-destructive hover:bg-destructive-foreground text-white'
									: 'bg-primary/90 hover:bg-primary text-primary-foreground'
							}`}
						>
							{isJoined ? 'Leave Group' : 'Join Group'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChosenGroupData;
