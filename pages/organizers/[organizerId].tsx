import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/libs/components/ui/button';
import { Badge } from '@/libs/components/ui/badge';
import { Card } from '@/libs/components/ui/card';
import { Calendar, Users, Heart, Eye, Mail } from 'lucide-react';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { Member } from '@/libs/types/member/member';
import { MemberType, MemberStatus } from '@/libs/enums/member.enum';
import { Event } from '@/libs/types/event/event';
import { EventStatus, EventCategory } from '@/libs/enums/event.enum';
import { Group } from '@/libs/types/group/group';
import { GroupCategory } from '@/libs/enums/group.enum';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { CommentGroup, CommentStatus } from '@/libs/enums/comment.enum';
import { Comment } from '@/libs/types/comment/comment';
import CommentsComponent from '@/libs/components/CommentsComponent';

const OrganizerDetailPage = () => {
	const router = useRouter();
	// const { organizerId } = router.query;
	const [isLiked, setIsLiked] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);

	const handleLike = async () => {
		try {
			setIsLiked(!isLiked);
			// TODO: Implement like/unlike API call
		} catch (error) {
			console.error('Error updating like:', error);
			setIsLiked(!isLiked);
		}
	};

	const handleFollow = async () => {
		try {
			setIsFollowing(!isFollowing);
			// TODO: Implement follow/unfollow API call
		} catch (error) {
			console.error('Error updating follow status:', error);
			setIsFollowing(!isFollowing);
		}
	};

	// Mock data
	const organizer: Member = {
		_id: '1',
		username: 'johnsmith',
		memberEmail: 'john@techconf.com',
		memberFullName: 'John Smith',
		memberPhone: '+1 234 567 8900',
		memberType: MemberType.ORGANIZER,
		memberStatus: MemberStatus.ACTIVE,
		emailVerified: false,
		memberImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
		memberDesc: 'Tech enthusiast and conference organizer with 10+ years of experience.',
		memberPoints: 100,
		memberLikes: 0,
		memberFollowings: 0,
		memberFollowers: 0,
		memberViews: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
	const organizerEvents: Event[] = [
		{
			_id: '1',
			eventName: 'Tech Meetup',
			eventDesc: 'A meetup for technology enthusiasts to share and learn.',
			eventImage: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
			eventDate: new Date('2024-04-01'),
			eventStartTime: '10:00',
			eventEndTime: '12:00',
			eventAddress: '123 Main St, Anytown, USA',
			eventCapacity: 100,
			eventPrice: 0,
			eventStatus: EventStatus.UPCOMING,
			eventCategories: [EventCategory.TECHNOLOGY],
			groupId: '1',
			eventOrganizerId: '1',
			attendeeCount: 100,
			eventLikes: 100,
			eventViews: 100,
			createdAt: new Date('2024-04-01'),
			updatedAt: new Date('2024-04-01'),
		},
		{
			_id: '2',
			eventName: 'Tech Meetup',
			eventDesc: 'A meetup for technology enthusiasts to share and learn.',
			eventImage: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
			eventDate: new Date('2024-04-01'),
			eventStartTime: '10:00',
			eventEndTime: '12:00',
			eventAddress: '123 Main St, Anytown, USA',
			eventCapacity: 100,
			eventPrice: 0,
			eventStatus: EventStatus.UPCOMING,
			eventCategories: [EventCategory.TECHNOLOGY],
			groupId: '1',
			eventOrganizerId: '1',
			attendeeCount: 100,
			eventLikes: 100,
			eventViews: 100,
			createdAt: new Date('2024-04-01'),
			updatedAt: new Date('2024-04-01'),
		},
	];

	const organizerGroups: Group[] = [
		{
			_id: '1',
			groupLink: '/groups/1',
			groupName: 'Tech Enthusiasts',
			groupDesc:
				'A community for technology enthusiasts to share and learn. Join us for discussions, events, and networking opportunities.',
			groupImage: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
			groupOwnerId: 'owner1',
			groupCategories: [GroupCategory.TECHNOLOGY],
			groupViews: 1000,
			groupLikes: 500,
			memberCount: 150,
			eventsCount: 10,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			_id: '1',
			groupLink: '/groups/1',
			groupName: 'Tech Enthusiasts',
			groupDesc:
				'A community for technology enthusiasts to share and learn. Join us for discussions, events, and networking opportunities.',
			groupImage: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
			groupOwnerId: 'owner1',
			groupCategories: [GroupCategory.TECHNOLOGY],
			groupViews: 1000,
			groupLikes: 500,
			memberCount: 150,
			eventsCount: 10,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			_id: '1',
			groupLink: '/groups/1',
			groupName: 'Tech Enthusiasts',
			groupDesc:
				'A community for technology enthusiasts to share and learn. Join us for discussions, events, and networking opportunities.',
			groupImage: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
			groupOwnerId: 'owner1',
			groupCategories: [GroupCategory.TECHNOLOGY],
			groupViews: 1000,
			groupLikes: 500,
			memberCount: 150,
			eventsCount: 10,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	const comments: Comment[] = [
		{
			_id: '1',
			commentStatus: CommentStatus.ACTIVE,
			commentGroup: CommentGroup.MEMBER,
			commentContent: 'Great group! Looking forward to the next meetup.',
			commentRefId: '1',
			memberId: 'user1',
			createdAt: new Date('2024-03-15'),
			updatedAt: new Date('2024-03-15'),
		},
		{
			_id: '2',
			commentStatus: CommentStatus.ACTIVE,
			commentGroup: CommentGroup.MEMBER,
			commentContent: 'The last workshop was very informative. Thanks for organizing!',
			commentRefId: '1',
			memberId: 'user2',
			createdAt: new Date('2024-03-20'),
			updatedAt: new Date('2024-03-20'),
		},
	];

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-between items-center mb-8">
					<Button
						variant="ghost"
						onClick={() => router.push('/organizers')}
						className="text-muted-foreground hover:text-foreground transition-colors duration-200"
					>
						← Back to Organizers
					</Button>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Organizer Profile Section */}
					<div className=" lg:col-span-2 bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
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
									<h1 className="text-4xl font-semibold text-foreground tracking-tight mb-2">
										{organizer.memberFullName}
									</h1>
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
										onClick={handleFollow}
										className="focus:ring-0 focus:border-primary/50"
									>
										{isFollowing ? 'Following' : 'Follow'}
									</Button>
									<button
										onClick={handleLike}
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

					{/* Sidebar */}
					<div className="space-y-8">
						{/* Groups Section */}
						<Card className="p-6">
							<h3 className="text-lg font-semibold text-foreground mb-4">Admin Groups</h3>
							<div className="space-y-4">
								{organizerGroups.map((group) => (
									<Link key={group._id} href={`/groups/${group._id}`}>
										<div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
											<div className="relative w-12 h-12 rounded-lg overflow-hidden">
												<Image src={group.groupImage} alt={group.groupName} fill className="object-cover" />
											</div>
											<div>
												<h4 className="font-semibold text-foreground">{group.groupName}</h4>
												<div className="flex items-center space-x-2 text-sm text-muted-foreground">
													<Users className="h-4 w-4" />
													<span>{group.memberCount} members</span>
												</div>
											</div>
										</div>
									</Link>
								))}
							</div>
						</Card>
					</div>
				</div>

				{/* Events Section */}
				<div className="mt-8">
					<h2 className="text-2xl font-semibold text-foreground mb-6">Upcoming Events By {organizer.memberFullName}</h2>
					<Carousel className="w-full">
						<CarouselContent>
							{organizerEvents.map((event) => (
								<CarouselItem key={event._id} className="md:basis-1/2 lg:basis-1/3">
									<Link href={`/events/${event._id}`}>
										<Card className="overflow-hidden hover:shadow-md transition-shadow">
											<div className="relative h-48">
												<Image src={event.eventImage} alt={event.eventName} fill className="object-cover" />
											</div>
											<div className="p-4">
												<h3 className="font-semibold text-foreground mb-2">{event.eventName}</h3>
												<div className="flex items-center space-x-2 text-sm text-muted-foreground">
													<Calendar className="h-4 w-4" />
													<span>{event.eventDate.toLocaleDateString()}</span>
												</div>
											</div>
										</Card>
									</Link>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="focus:ring-0 focus:border-primary/50" />
						<CarouselNext className="focus:ring-0 focus:border-primary/50" />
					</Carousel>
				</div>

				{/* Comments Section */}
				<CommentsComponent comments={comments} commentGroup={CommentGroup.MEMBER} commentRefId={organizer._id} />
			</div>
		</div>
	);
};

export default withBasicLayout(OrganizerDetailPage);
