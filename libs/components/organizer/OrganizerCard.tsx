import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/libs/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/libs/components/ui/avatar';
import { Card } from '@/libs/components/ui/card';
import { Badge } from '@/libs/components/ui/badge';
import { Heart, UserPlus } from 'lucide-react';
import { MemberType } from '@/libs/enums/member.enum';

interface Organizer {
	_id: string;
	username: string;
	memberEmail: string;
	memberPhone?: string;
	memberFullName: string;
	memberType: MemberType;
	memberDesc?: string;
	memberImage?: string;
	memberPoints: number;
	memberLikes: number;
	memberFollowings: number;
	memberFollowers: number;
	memberViews: number;
	memberEvents: number;
}

interface OrganizerCardProps {
	organizer: Organizer;
}

const OrganizerCard = ({ organizer }: OrganizerCardProps) => {
	const router = useRouter();
	const [isLiked, setIsLiked] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);

	const handleLike = () => {
		setIsLiked(!isLiked);
	};

	const handleFollow = () => {
		setIsFollowing(!isFollowing);
	};

	return (
		<Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
			<div className="p-6">
				<div className="flex items-center gap-4 mb-4">
					<Avatar className="h-16 w-16">
						<AvatarImage src={organizer.memberImage} alt={organizer.memberFullName} />
						<AvatarFallback>
							{organizer.memberFullName
								.split(' ')
								.map((n) => n[0])
								.join('')}
						</AvatarFallback>
					</Avatar>
					<div>
						<div className="flex items-center gap-2">
							<h3 className="font-semibold text-lg">{organizer.memberFullName}</h3>
							<Badge variant="secondary" className="bg-primary/10 text-primary">
								{organizer.memberType}
							</Badge>
						</div>
						<p className="text-muted-foreground text-sm">@{organizer.username}</p>
					</div>
				</div>
				<p className="text-muted-foreground mb-4 line-clamp-2">{organizer.memberDesc}</p>
				<div className="grid grid-cols-3 gap-4 text-center">
					<div>
						<p className="font-semibold">{organizer.memberEvents}</p>
						<p className="text-sm text-muted-foreground">Events</p>
					</div>
					<div>
						<p className="font-semibold">{organizer.memberFollowers}</p>
						<p className="text-sm text-muted-foreground">Followers</p>
					</div>
					<div>
						<p className="font-semibold">{organizer.memberLikes}</p>
						<p className="text-sm text-muted-foreground">Likes</p>
					</div>
				</div>
			</div>
			<div className="border-t p-4">
				<div className="flex gap-2">
					<Button variant="outline" size="sm" className="flex-1" onClick={handleLike}>
						<Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
						{isLiked ? 'Liked' : 'Like'}
					</Button>
					<Button variant="outline" size="sm" className="flex-1" onClick={handleFollow}>
						<UserPlus className={`h-4 w-4 mr-2 ${isFollowing ? 'text-primary' : ''}`} />
						{isFollowing ? 'Following' : 'Follow'}
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="flex-1"
						onClick={() => router.push(`/organizers/${organizer._id}`)}
					>
						View Profile
					</Button>
				</div>
			</div>
		</Card>
	);
};

export default OrganizerCard;
