import { useState } from 'react';
import { useRouter } from 'next/router';
import { Member } from '@/libs/types/member/member';
import { MemberType, MemberStatus } from '@/libs/enums/member.enum';
import { EventStatus, EventCategory } from '@/libs/enums/event.enum';
import { GroupCategory } from '@/libs/enums/group.enum';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/libs/components/ui/button';
import { Badge } from '@/libs/components/ui/badge';
import { Card } from '@/libs/components/ui/card';
import { Calendar, Users, Heart, Eye, Mail, Globe } from 'lucide-react';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { Event } from '@/libs/types/event/event';
import { Group } from '@/libs/types/group/group';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/libs/components/ui/avatar';

const OrganizerDetailPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const [isLiked, setIsLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(0);
	const [isFollowing, setIsFollowing] = useState(false);
	const [comment, setComment] = useState('');
	const [comments, setComments] = useState([
		{
			id: '1',
			user: {
				name: 'Sarah Johnson',
				avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
			},
			text: 'Great organizer! The events are always well-planned and engaging.',
			date: new Date('2024-04-28'),
		},
		{
			id: '2',
			user: {
				name: 'Michael Chen',
				avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
			},
			text: "I've attended several events and they were all fantastic experiences.",
			date: new Date('2024-04-27'),
		},
	]);

	const handleLike = async () => {
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

	const handleFollow = async () => {
		try {
			setIsFollowing(!isFollowing);
			// TODO: Implement follow/unfollow API call
		} catch (error) {
			console.error('Error updating follow status:', error);
			setIsFollowing(!isFollowing);
		}
	};

	const handleCommentSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!comment.trim()) return;

		const newComment = {
			id: Date.now().toString(),
			user: {
				name: 'Current User',
				avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
			},
			text: comment,
			date: new Date(),
		};

		setComments([newComment, ...comments]);
		setComment('');
	};

	// Mock data
	const organizer: Member = {
		_id: '1',
		username: 'techorganizer',
		memberEmail: 'john@techconf.com',
		memberFullName: 'John Smith',
		memberType: MemberType.ORGANIZER,
		memberStatus: MemberStatus.ACTIVE,
		emailVerified: true,
		memberDesc: 'Tech enthusiast and conference organizer with 10+ years of experience.',
		memberImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
		memberPoints: 1000,
		memberLikes: 500,
		memberFollowings: 50,
		memberFollowers: 1000,
		memberViews: 5000,
		createdAt: new Date(),
		updatedAt: new Date(),
		memberPassword: 'hashed_password',
	};

	const organizerEvents: Event[] = [
		{
			_id: '1',
			eventName: 'Tech Conference 2024',
			eventDesc: 'Join us for the biggest tech conference of the year!',
			eventImage: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
			eventDate: new Date('2024-12-15'),
			eventStartTime: '09:00',
			eventEndTime: '18:00',
			eventAddress: '123 Tech Street, Silicon Valley',
			eventCapacity: 100,
			eventPrice: 99,
			eventStatus: EventStatus.UPCOMING,
			eventCategories: [EventCategory.TECHNOLOGY, EventCategory.BUSINESS],
			groupId: '1',
			eventOrganizerId: '1',
			attendeeCount: 0,
			eventLikes: 0,
			eventViews: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			_id: '2',
			eventName: 'AI Summit 2024',
			eventDesc: 'Explore the future of artificial intelligence.',
			eventImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
			eventDate: new Date('2024-11-20'),
			eventStartTime: '10:00',
			eventEndTime: '17:00',
			eventAddress: '456 AI Avenue, Tech City',
			eventCapacity: 200,
			eventPrice: 149,
			eventStatus: EventStatus.UPCOMING,
			eventCategories: [EventCategory.TECHNOLOGY, EventCategory.EDUCATION],
			groupId: '1',
			eventOrganizerId: '1',
			attendeeCount: 0,
			eventLikes: 0,
			eventViews: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	const organizerGroups: Group[] = [
		{
			_id: '1',
			groupName: 'Tech Innovators',
			groupDesc: 'A community of technology enthusiasts and professionals.',
			groupImage: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
			groupLink: 'https://techconf.com',
			groupCategories: [GroupCategory.TECHNOLOGY],
			groupOwnerId: '1',
			groupViews: 1000,
			groupLikes: 500,
			memberCount: 1500,
			eventsCount: 25,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			_id: '2',
			groupName: 'AI & ML Community',
			groupDesc: 'Discussing artificial intelligence and machine learning topics.',
			groupImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
			groupLink: 'https://techconf.com',
			eventsCount: 25,
			groupCategories: [GroupCategory.TECHNOLOGY],
			groupOwnerId: '1',
			groupViews: 800,
			groupLikes: 400,
			memberCount: 1200,
			createdAt: new Date(),
			updatedAt: new Date(),
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
					<div className="lg:col-span-2">
						<div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
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
											<span className="text-sm">{likesCount} likes</span>
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
									<div className="flex items-center space-x-3">
										<Globe className="h-5 w-5 text-muted-foreground" />
										<span className="text-foreground">techconf.com</span>
									</div>
								</div>
							</div>
						</div>

						{/* Events Section */}
						<div className="mt-8">
							<h2 className="text-2xl font-semibold text-foreground mb-6">Upcoming Events</h2>
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
						<div className="mt-8">
							<h2 className="text-2xl font-semibold text-foreground mb-6">Comments</h2>
							<form onSubmit={handleCommentSubmit} className="mb-8">
								<Textarea
									placeholder="Write a comment..."
									value={comment}
									onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
									className="min-h-[100px] mb-4 focus:ring-0 focus:border-primary/50"
								/>
								<Button type="submit" className="focus:ring-0 focus:border-primary/50">
									Post Comment
								</Button>
							</form>
							<div className="space-y-6">
								{comments.map((comment) => (
									<div key={comment.id} className="flex space-x-4">
										<Avatar>
											<AvatarImage src={comment.user.avatar} alt={comment.user.name} />
											<AvatarFallback>{comment.user.name[0]}</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<div className="flex items-center justify-between mb-1">
												<h4 className="font-semibold text-foreground">{comment.user.name}</h4>
												<span className="text-sm text-muted-foreground">{comment.date?.toLocaleDateString()}</span>
											</div>
											<p className="text-muted-foreground">{comment.text}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-8">
						<Card className="p-6">
							<h3 className="text-lg font-semibold text-foreground mb-4">Organizer Stats</h3>
							<div className="grid grid-cols-2 gap-4">
								<div className="text-center p-4 bg-muted/50 rounded-lg">
									<div className="text-2xl font-bold text-foreground">{organizerEvents.length}</div>
									<div className="text-sm text-muted-foreground">Events</div>
								</div>
								<div className="text-center p-4 bg-muted/50 rounded-lg">
									<div className="text-2xl font-bold text-foreground">{organizerGroups.length}</div>
									<div className="text-sm text-muted-foreground">Groups</div>
								</div>
								<div className="text-center p-4 bg-muted/50 rounded-lg">
									<div className="text-2xl font-bold text-foreground">{organizer.memberFollowers}</div>
									<div className="text-sm text-muted-foreground">Followers</div>
								</div>
								<div className="text-center p-4 bg-muted/50 rounded-lg">
									<div className="text-2xl font-bold text-foreground">{organizer.memberPoints}</div>
									<div className="text-sm text-muted-foreground">Points</div>
								</div>
							</div>
						</Card>

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
			</div>
		</div>
	);
};

export default withBasicLayout(OrganizerDetailPage);
