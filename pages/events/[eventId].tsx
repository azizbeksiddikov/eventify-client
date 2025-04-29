import { useState } from 'react';
import { useRouter } from 'next/router';
import { Event } from '@/libs/types/event/event';
import { EventStatus, EventCategory } from '@/libs/enums/event.enum';
import { MemberType } from '@/libs/enums/member.enum';
import { GroupCategory } from '@/libs/enums/group.enum';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Badge } from '@/libs/components/ui/badge';
import { Card } from '@/libs/components/ui/card';
import { Separator } from '@/libs/components/ui/separator';
import { Avatar } from '@/libs/components/ui/avatar';
import { Calendar, Clock, MapPin, Users, MessageSquare, Heart, Eye } from 'lucide-react';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { Group } from '@/libs/types/group/group';
import { Member } from '@/libs/types/member/member';

const EventDetailPage = () => {
	const router = useRouter();
	const { eventId } = router.query;
	const [isLiked, setIsLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(0);
	const [newComment, setNewComment] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);

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
	};

	const organizer: Member = {
		_id: '1',
		memberEmail: 'john@techconf.com',
		memberFullName: 'John Smith',
		memberPhone: '+1 234 567 8900',
		memberType: MemberType.ORGANIZER,
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
		groupLink: 'https://techconf.com',
		groupName: 'Tech Innovators',
		groupDesc: 'A community of technology enthusiasts and professionals.',
		groupImage: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
		groupCategories: [GroupCategory.TECHNOLOGY],
		groupOwnerId: '1',
		groupViews: 1000,
		groupLikes: 500,
		memberCount: 1500,
		eventsCount: 25,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const similarEvents: Event[] = [
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
		{
			_id: '3',
			eventName: 'Startup Pitch Night',
			eventDesc: 'Watch innovative startups pitch their ideas.',
			eventImage: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
			eventDate: new Date('2024-12-10'),
			eventStartTime: '18:00',
			eventEndTime: '21:00',
			eventAddress: '789 Startup Blvd, Innovation Hub',
			eventCapacity: 150,
			eventPrice: 49,
			eventStatus: EventStatus.UPCOMING,
			eventCategories: [EventCategory.BUSINESS, EventCategory.TECHNOLOGY],
			groupId: '1',
			eventOrganizerId: '1',
			attendeeCount: 0,
			eventLikes: 0,
			eventViews: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	// Mock comments data
	const comments = [
		{
			id: '1',
			author: {
				name: 'John Doe',
				avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
			},
			content: "This event looks amazing! I'm really looking forward to attending.",
			createdAt: new Date('2024-03-15'),
		},
		{
			id: '2',
			author: {
				name: 'Jane Smith',
				avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
			},
			content: "The speaker lineup is impressive. Can't wait to learn from these experts!",
			createdAt: new Date('2024-03-16'),
		},
	];

	const handleCommentSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim()) return;

		setIsSubmitting(true);
		try {
			// TODO: Implement comment submission logic
			console.log('Submitting comment:', newComment);
			setNewComment('');
			setIsCommentFormOpen(false);
		} catch (error) {
			console.error('Error submitting comment:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handlePurchase = () => {
		// TODO: Implement purchase logic
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
						<div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
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
				<div className="mt-8">
					<Card className="p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-semibold text-foreground">Comments</h2>
							<Button
								variant="outline"
								size="sm"
								className="text-muted-foreground hover:text-foreground"
								onClick={() => setIsCommentFormOpen(!isCommentFormOpen)}
							>
								<MessageSquare className="h-4 w-4 mr-2" />
								{isCommentFormOpen ? 'Cancel' : 'Write a Comment'}
							</Button>
						</div>

						{isCommentFormOpen && (
							<form onSubmit={handleCommentSubmit} className="mb-6">
								<div className="flex items-start space-x-4">
									<Avatar className="h-10 w-10">
										<Image
											src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
											alt="User avatar"
											fill
											className="object-cover"
										/>
									</Avatar>
									<div className="flex-1 space-y-2">
										<Input
											placeholder="Write a comment..."
											value={newComment}
											onChange={(e) => setNewComment(e.target.value)}
											className="min-h-[80px] resize-none"
										/>
										<div className="flex justify-end space-x-2">
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => {
													setIsCommentFormOpen(false);
													setNewComment('');
												}}
											>
												Cancel
											</Button>
											<Button
												type="submit"
												size="sm"
												disabled={isSubmitting || !newComment.trim()}
												className="bg-primary/90 hover:bg-primary text-primary-foreground"
											>
												{isSubmitting ? 'Posting...' : 'Post Comment'}
											</Button>
										</div>
									</div>
								</div>
							</form>
						)}

						<Separator className="my-6" />

						<div className="space-y-6">
							{comments.map((comment) => (
								<div key={comment.id} className="flex space-x-4">
									<Avatar className="h-10 w-10">
										<Image src={comment.author.avatar} alt={comment.author.name} fill className="object-cover" />
									</Avatar>
									<div className="flex-1">
										<div className="flex items-center justify-between">
											<h4 className="font-medium text-foreground">{comment.author.name}</h4>
											<span className="text-sm text-muted-foreground">{comment.createdAt.toLocaleDateString()}</span>
										</div>
										<p className="mt-1 text-muted-foreground">{comment.content}</p>
									</div>
								</div>
							))}
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default withBasicLayout(EventDetailPage);
