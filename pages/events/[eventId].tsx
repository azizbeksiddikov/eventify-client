import { useState } from 'react';
import { useRouter } from 'next/router';
import { Event } from '@/libs/types/event/event';
import { EventStatus, EventCategory } from '@/libs/enums/event.enum';
import { MemberStatus, MemberType } from '@/libs/enums/member.enum';
import { GroupCategory } from '@/libs/enums/group.enum';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Badge } from '@/libs/components/ui/badge';
import { Card } from '@/libs/components/ui/card';
import { Avatar } from '@/libs/components/ui/avatar';
import { Calendar, Clock, MapPin, Users, Heart, Eye } from 'lucide-react';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { Group } from '@/libs/types/group/group';
import { Member } from '@/libs/types/member/member';
import Comments from '@/libs/components/common/CommentsComponent';
import { CommentGroup } from '@/libs/enums/comment.enum';
import { CommentStatus } from '@/libs/enums/comment.enum';
import { Comment } from '@/libs/types/comment/comment';

const EventDetailPage = () => {
	const router = useRouter();
	// const { eventId } = router.query;
	const [isLiked, setIsLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(0);

	const handleLike = async () => {
		try {
			setIsLiked(!isLiked);
			setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
			// TODO: Implement like/unlike API call
			console.log(isLiked ? 'Unliking event' : 'Liking event');
		} catch (error) {
			console.error('Error updating like:', error);
			// Revert changes if API call fails
			setIsLiked(!isLiked);
			setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
		}
	};

	// Mock data
	const event: Event = {
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
	};

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

	const group: Group = {
		_id: '1',
		groupLink: '/groups/1',
		groupName: 'Tech Enthusiasts',
		groupDesc:
			'A community for technology enthusiasts to share and learn. Join us for discussions, events, and networking opportunities.',
		groupImage: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
		groupOwnerId: 'owner1',
		groupCategories: [GroupCategory.TECHNOLOGY, GroupCategory.SPORTS],
		groupViews: 1000,
		groupLikes: 500,
		memberCount: 150,
		eventsCount: 10,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const similarEvents: Event[] = [
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

	// Mock comments data
	const comments: Comment[] = [
		{
			_id: '1',
			commentStatus: CommentStatus.ACTIVE,
			commentGroup: CommentGroup.GROUP,
			commentContent: 'Great group! Looking forward to the next meetup.',
			commentRefId: '1',
			memberId: 'user1',
			createdAt: new Date('2024-03-15'),
			updatedAt: new Date('2024-03-15'),
		},
		{
			_id: '2',
			commentStatus: CommentStatus.ACTIVE,
			commentGroup: CommentGroup.GROUP,
			commentContent: 'The last workshop was very informative. Thanks for organizing!',
			commentRefId: '1',
			memberId: 'user2',
			createdAt: new Date('2024-03-20'),
			updatedAt: new Date('2024-03-20'),
		},
	];

	const handlePurchase = () => {
		console.log('Purchasing 1 ticket');
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-between items-center mb-8">
					<Button
						variant="ghost"
						onClick={() => router.push('/events')}
						className="text-muted-foreground hover:text-foreground transition-colors duration-200"
					>
						← Back to Events
					</Button>
					<Button
						onClick={() => router.push('/events/create')}
						className="bg-primary/90 hover:bg-primary text-primary-foreground px-6"
					>
						Create Event
					</Button>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<div className="bg-card rounded-2xl shadow-sm  overflow-hidden">
							<div className="relative h-[400px] w-full">
								<Image src={event.eventImage} alt={event.eventName} fill className="object-cover" priority />
							</div>
							<div className="p-8">
								<div className="flex justify-between items-start mb-8">
									<div>
										<h1 className="text-4xl font-semibold text-foreground tracking-tight mb-2">{event.eventName}</h1>
										<div className="flex items-center space-x-2">
											<Badge variant="secondary" className="bg-muted/50 text-muted-foreground">
												{event.eventStatus}
											</Badge>
											{event.eventCategories.map((category) => (
												<Badge key={category} variant="outline" className="border-muted/50 text-muted-foreground">
													{category}
												</Badge>
											))}
										</div>
									</div>
									<div className="text-right">
										<div className="text-3xl font-bold text-primary">${event.eventPrice}</div>
										<div className="text-sm text-muted-foreground">per ticket</div>
									</div>
								</div>
								<div className="flex items-center space-x-6 mb-8">
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
									<div className="flex items-center space-x-2 text-muted-foreground">
										<Eye className="h-5 w-5" />
										<span className="text-sm">{event.eventViews} views</span>
									</div>
								</div>
								<div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
									<div className="space-y-6">
										<div className="flex items-center space-x-3">
											<Calendar className="h-5 w-5 text-muted-foreground" />
											<span className="text-foreground">
												{event.eventDate.toLocaleDateString('en-US', {
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric',
												})}
											</span>
										</div>
										<div className="flex items-center space-x-3">
											<Clock className="h-5 w-5 text-muted-foreground" />
											<span className="text-foreground">
												{event.eventStartTime} - {event.eventEndTime}
											</span>
										</div>
										<div className="flex items-center space-x-3">
											<MapPin className="h-5 w-5 text-muted-foreground" />
											<span className="text-foreground">{event.eventAddress}</span>
										</div>
										<div className="flex items-center space-x-3">
											<Users className="h-5 w-5 text-muted-foreground" />
											<span className="text-foreground">{event.eventCapacity} capacity</span>
										</div>
									</div>
									<div className="space-y-4">
										<div>
											<h3 className="text-lg font-semibold mb-3 text-foreground">Description</h3>
											<p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.eventDesc}</p>
										</div>
									</div>
								</div>
								<div className="mt-8 border-t border-border/50 pt-6 flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<label htmlFor="ticketCount" className="text-sm font-medium text-foreground">
											Tickets:
										</label>
										<Input
											type="number"
											id="ticketCount"
											value={1}
											disabled
											className="w-20 bg-muted/50 border-muted/50"
										/>
									</div>
									<Button
										onClick={handlePurchase}
										size="lg"
										className="bg-primary/90 hover:bg-primary text-primary-foreground px-8"
									>
										Register
									</Button>
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-6">
						{organizer && (
							<Card className="p-6">
								<h2 className="text-xl font-semibold mb-4 text-foreground">Organizer</h2>
								<div className="flex items-center space-x-4">
									<Avatar className="h-16 w-16">
										<Image
											src={organizer?.memberImage || '/images/default-avatar.jpg'}
											alt={organizer?.memberFullName}
											fill
											className="object-cover"
										/>
									</Avatar>
									<div>
										<h3 className="font-semibold text-foreground">{organizer?.memberFullName ?? 'No Name'}</h3>
										<p className="text-sm text-muted-foreground">{organizer?.memberDesc ?? 'No Description'}</p>
									</div>
								</div>
							</Card>
						)}

						{group && (
							<Card className="p-6">
								<h2 className="text-xl font-semibold mb-4 text-foreground">Hosting Group</h2>
								<div className="flex items-center space-x-4">
									<Avatar className="h-16 w-16 rounded-lg">
										<Image src={group.groupImage} alt={group.groupName} fill className="object-cover" />
									</Avatar>
									<div>
										<Link href={`/groups/${group._id}`}>
											<h3 className="font-semibold text-foreground hover:text-primary transition-colors duration-200">
												{group.groupName}
											</h3>
										</Link>
										<p className="text-sm text-muted-foreground">{group.groupDesc}</p>
										<div className="flex items-center space-x-4 mt-2">
											<span className="text-sm text-muted-foreground">{group.memberCount} members</span>
											<span className="text-sm text-muted-foreground">{group.eventsCount} events</span>
										</div>
									</div>
								</div>
							</Card>
						)}

						{similarEvents.length > 0 && (
							<Card className="p-6">
								<h2 className="text-xl font-semibold mb-4 text-foreground">Similar Events</h2>
								<div className="space-y-4">
									{similarEvents.map((similarEvent) => (
										<Link key={similarEvent._id} href={`/events/${similarEvent._id}`}>
											<div className="flex space-x-4 hover:bg-muted/50 p-3 rounded-xl transition-colors duration-200">
												<div className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0">
													<Image
														src={similarEvent.eventImage}
														alt={similarEvent.eventName}
														fill
														className="object-cover"
													/>
												</div>
												<div>
													<h4 className="font-medium text-foreground hover:text-primary transition-colors duration-200">
														{similarEvent.eventName}
													</h4>
													<p className="text-sm text-muted-foreground">{similarEvent.eventDate.toLocaleDateString()}</p>
													<div className="flex space-x-2 mt-1">
														{similarEvent.eventCategories.map((category) => (
															<Badge
																key={category}
																variant="outline"
																className="border-muted/50 text-muted-foreground text-xs"
															>
																{category}
															</Badge>
														))}
													</div>
												</div>
											</div>
										</Link>
									))}
								</div>
							</Card>
						)}
					</div>
				</div>

				{/* Comments Section */}
				<Comments comments={comments} commentGroup={CommentGroup.EVENT} commentRefId={event._id} />
			</div>
		</div>
	);
};

export default withBasicLayout(EventDetailPage);
