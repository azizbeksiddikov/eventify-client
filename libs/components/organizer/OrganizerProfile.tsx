import Image from 'next/image';
import { Badge } from '@/libs/components/ui/badge';
import { Button } from '@/libs/components/ui/button';
import { Users, Heart, Eye, Mail } from 'lucide-react';
import { Member } from '@/libs/types/member/member';

interface OrganizerProfileProps {
	organizer: Member;
	isLiked: boolean;
	isFollowing: boolean;
	onLike: () => void;
	onFollow: () => void;
}

const OrganizerProfile = ({ organizer, isLiked, isFollowing, onLike, onFollow }: OrganizerProfileProps) => {
	return (
		<div className="lg:col-span-2 bg-card rounded-2xl shadow-sm overflow-hidden">
			<div className="relative h-[400px] w-full">
				<Image
					src={organizer.memberImage || '/images/default-avatar.jpg'}
					alt={organizer.memberFullName}
					fill
					className="object-cover"
					priority
				/>
			</div>
			<div className="p-8">
				<div className="flex justify-between items-start mb-8">
					<div>
						<h1 className="text-4xl font-semibold text-foreground tracking-tight mb-2">{organizer.memberFullName}</h1>
						<div className="flex items-center space-x-2">
							<Badge variant="secondary" className="bg-muted/50 text-muted-foreground">
								{organizer.memberType}
							</Badge>
							<Badge variant="outline" className="border-muted/50 text-muted-foreground">
								{organizer.memberPoints} points
							</Badge>
						</div>
					</div>
					<div className="flex items-center space-x-4">
						<Button
							variant={isFollowing ? 'outline' : 'default'}
							onClick={onFollow}
							className="focus:ring-0 focus:border-primary/50"
						>
							{isFollowing ? 'Following' : 'Follow'}
						</Button>
						<button
							onClick={onLike}
							className={`flex items-center space-x-2 transition-all duration-200 ${
								isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-primary'
							}`}
						>
							<Heart
								className={`h-5 w-5 transition-all duration-200 ${
									isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
								}`}
							/>
							<span className="text-sm">{organizer.memberLikes} likes</span>
						</button>
					</div>
				</div>
				<div className="flex items-center space-x-6 mb-8">
					<div className="flex items-center space-x-2 text-muted-foreground">
						<Eye className="h-5 w-5" />
						<span className="text-sm">{organizer.memberViews} views</span>
					</div>
					<div className="flex items-center space-x-2 text-muted-foreground">
						<Users className="h-5 w-5" />
						<span className="text-sm">{organizer.memberFollowers} followers</span>
					</div>
				</div>
				<div className="prose prose-sm max-w-none text-muted-foreground mb-8">{organizer.memberDesc}</div>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
					<div className="flex items-center space-x-3">
						<Mail className="h-5 w-5 text-muted-foreground" />
						<span className="text-foreground">{organizer.memberEmail}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrganizerProfile;
