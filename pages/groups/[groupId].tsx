import { useState } from 'react';
import { useRouter } from 'next/router';
import { Group } from '@/libs/types/group/group';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/libs/components/ui/button';
import { Badge } from '@/libs/components/ui/badge';
import { Card } from '@/libs/components/ui/card';
import { Avatar } from '@/libs/components/ui/avatar';
import { Users, Calendar, MessageSquare, Heart, Eye, ChevronRight, Shield, Crown } from 'lucide-react';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { GroupMember } from '@/libs/types/groupMembers/groupMember';
import { GroupMemberRole, GroupCategory } from '@/libs/enums/group.enum';
import { Event } from '@/libs/types/event/event';
import { Comment } from '@/libs/types/comment/comment';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Textarea } from '@/components/ui/textarea';

const GroupDetailPage = () => {
	const router = useRouter();
	const { groupId } = router.query;
	const [isLiked, setIsLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(0);
	const [isJoined, setIsJoined] = useState(false);
	const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
	const [newComment, setNewComment] = useState('');

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

	const handleJoin = async () => {
		try {
			setIsJoined(true);
			// TODO: Implement join group API call
		} catch (error) {
			console.error('Error joining group:', error);
			setIsJoined(false);
		}
	};

	const handleAddComment = () => {
		if (newComment.trim()) {
			// TODO: Implement comment submission
			setNewComment('');
			setIsCommentModalOpen(false);
		}
	};

	// Mock data
	const group: Group = {
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
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const similarGroups: Group[] = [
		{
			_id: '2',
			groupLink: '/groups/2',
			groupName: 'Web Developers',
			groupDesc: 'A community for web developers to share knowledge and collaborate.',
			groupImage: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
			groupOwnerId: 'owner2',
			groupCategories: [GroupCategory.TECHNOLOGY],
			groupViews: 800,
			groupLikes: 400,
			memberCount: 200,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			_id: '3',
			groupLink: '/groups/3',
			groupName: 'AI & ML Community',
			groupDesc: 'Discussing artificial intelligence and machine learning topics.',
			groupImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
			groupOwnerId: 'owner3',
			groupCategories: [GroupCategory.TECHNOLOGY],
			groupViews: 600,
			groupLikes: 300,
			memberCount: 120,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	// Mock data for group members
	const groupMembers: GroupMember[] = [
		{
			_id: '1',
			groupId: '1',
			memberId: 'owner1',
			groupMemberRole: GroupMemberRole.OWNER,
			joinDate: new Date('2024-01-01'),
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			_id: '2',
			groupId: '1',
			memberId: 'mod1',
			groupMemberRole: GroupMemberRole.MODERATOR,
			joinDate: new Date('2024-01-15'),
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			_id: '3',
			groupId: '1',
			memberId: 'mod2',
			groupMemberRole: GroupMemberRole.MODERATOR,
			joinDate: new Date('2024-02-01'),
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	// Mock data for member profiles
	const memberProfiles = {
		owner1: {
			name: 'John Smith',
			avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
			bio: 'Tech enthusiast and community leader',
		},
		mod1: {
			name: 'Sarah Johnson',
			avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
			bio: 'Web developer and community moderator',
		},
		mod2: {
			name: 'Mike Brown',
			avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
			bio: 'Software engineer and content moderator',
		},
	};

	// Mock data for group events
	const groupEvents: Event[] = [
		{
			_id: '1',
			eventName: 'Tech Meetup',
			eventDesc: 'Monthly tech meetup for developers',
			eventImage: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
			eventDate: new Date('2024-04-15'),
			eventTime: '18:00',
			eventLocation: 'Tech Hub, Downtown',
			eventCategories: [GroupCategory.TECHNOLOGY],
			eventViews: 150,
			eventLikes: 75,
			eventParticipants: 50,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			_id: '2',
			eventName: 'Web Development Workshop',
			eventDesc: 'Hands-on workshop for web developers',
			eventImage: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
			eventDate: new Date('2024-04-20'),
			eventTime: '14:00',
			eventLocation: 'Innovation Center',
			eventCategories: [GroupCategory.TECHNOLOGY],
			eventViews: 200,
			eventLikes: 100,
			eventParticipants: 30,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	// Mock data for group comments
	const groupComments: Comment[] = [
		{
			_id: '1',
			content: 'Great group! Looking forward to the next meetup.',
			authorId: 'user1',
			groupId: '1',
			createdAt: new Date('2024-03-15'),
			updatedAt: new Date('2024-03-15'),
		},
		{
			_id: '2',
			content: 'The last workshop was very informative. Thanks for organizing!',
			authorId: 'user2',
			groupId: '1',
			createdAt: new Date('2024-03-20'),
			updatedAt: new Date('2024-03-20'),
		},
	];

	// Mock data for comment authors
	const commentAuthors = {
		user1: {
			name: 'Alex Johnson',
			avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
		},
		user2: {
			name: 'Emily Davis',
			avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
		},
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-between items-center mb-8">
					<Button
						variant="ghost"
						onClick={() => router.push('/groups')}
						className="text-muted-foreground hover:text-foreground transition-colors duration-200"
					>
						← Back to Groups
					</Button>
					<Button
						onClick={() => router.push('/groups/create')}
						className="bg-primary/90 hover:bg-primary text-primary-foreground px-6"
					>
						Create Group
					</Button>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
							<div className="relative h-[400px] w-full">
								<Image src={group.groupImage} alt={group.groupName} fill className="object-cover" priority />
							</div>
							<div className="p-8">
								<div className="flex justify-between items-start mb-8">
									<div>
										<h1 className="text-4xl font-semibold text-foreground tracking-tight mb-2">{group.groupName}</h1>
										<div className="flex items-center space-x-2">
											{group.groupCategories.map((category) => (
												<Badge key={category} variant="outline" className="border-muted/50 text-muted-foreground">
													#{category}
												</Badge>
											))}
										</div>
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
										<span className="text-sm">{group.groupViews} views</span>
									</div>
								</div>
								<div className="space-y-6">
									<div>
										<h3 className="text-lg font-semibold mb-3 text-foreground">About</h3>
										<p className="text-muted-foreground leading-relaxed whitespace-pre-line">{group.groupDesc}</p>
									</div>
									<div className="flex items-center space-x-3">
										<Users className="h-5 w-5 text-muted-foreground" />
										<span className="text-foreground">{group.memberCount} members</span>
									</div>
									<div className="flex items-center space-x-3">
										<Calendar className="h-5 w-5 text-muted-foreground" />
										<span className="text-foreground">Created {group.createdAt.toLocaleDateString()}</span>
									</div>
								</div>
								<div className="mt-8 border-t border-border/50 pt-6">
									<Button
										onClick={handleJoin}
										size="lg"
										className={`w-full ${
											isJoined
												? 'bg-green-600 hover:bg-green-700 text-white'
												: 'bg-primary/90 hover:bg-primary text-primary-foreground'
										}`}
										disabled={isJoined}
									>
										{isJoined ? 'Joined' : 'Join Group'}
									</Button>
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-6">
						{/* Group Owner Section */}
						<Card className="p-6">
							<h2 className="text-xl font-semibold mb-4 text-foreground">Group Owner</h2>
							<div className="flex items-center space-x-4">
								<Avatar className="h-16 w-16">
									<Image
										src={memberProfiles.owner1.avatar}
										alt={memberProfiles.owner1.name}
										fill
										className="object-cover"
									/>
								</Avatar>
								<div>
									<div className="flex items-center gap-2">
										<h3 className="font-semibold text-foreground">{memberProfiles.owner1.name}</h3>
										<Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
											<Crown className="h-3 w-3 mr-1" />
											Owner
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground">{memberProfiles.owner1.bio}</p>
								</div>
							</div>
						</Card>

						{/* Moderators Section */}
						<Card className="p-6">
							<h2 className="text-xl font-semibold mb-4 text-foreground">Moderators</h2>
							<div className="space-y-4">
								{groupMembers
									.filter((member) => member.groupMemberRole === GroupMemberRole.MODERATOR)
									.map((moderator) => (
										<div key={moderator._id} className="flex items-center space-x-4">
											<Avatar className="h-12 w-12">
												<Image
													src={memberProfiles[moderator.memberId].avatar}
													alt={memberProfiles[moderator.memberId].name}
													fill
													className="object-cover"
												/>
											</Avatar>
											<div>
												<div className="flex items-center gap-2">
													<h3 className="font-medium text-foreground">{memberProfiles[moderator.memberId].name}</h3>
													<Badge variant="secondary" className="bg-blue-100 text-blue-800">
														<Shield className="h-3 w-3 mr-1" />
														Moderator
													</Badge>
												</div>
												<p className="text-sm text-muted-foreground">{memberProfiles[moderator.memberId].bio}</p>
												<p className="text-xs text-muted-foreground">
													Joined {moderator.joinDate.toLocaleDateString()}
												</p>
											</div>
										</div>
									))}
							</div>
						</Card>

						{similarGroups.length > 0 && (
							<Card className="p-6">
								<h2 className="text-xl font-semibold mb-4 text-foreground">Similar Groups</h2>
								<div className="space-y-4">
									{similarGroups.map((similarGroup) => (
										<Link key={similarGroup._id} href={`/groups/${similarGroup._id}`}>
											<div className="flex space-x-4 hover:bg-muted/50 p-3 rounded-xl transition-colors duration-200">
												<div className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0">
													<Image
														src={similarGroup.groupImage}
														alt={similarGroup.groupName}
														fill
														className="object-cover"
													/>
												</div>
												<div>
													<h4 className="font-medium text-foreground hover:text-primary transition-colors duration-200">
														{similarGroup.groupName}
													</h4>
													<p className="text-sm text-muted-foreground">{similarGroup.memberCount} members</p>
													<div className="flex space-x-2 mt-1">
														{similarGroup.groupCategories.map((category) => (
															<Badge
																key={category}
																variant="outline"
																className="border-muted/50 text-muted-foreground text-xs"
															>
																#{category}
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

				{/* Events Section */}
				<div className="mt-8">
					<h2 className="text-2xl font-semibold mb-6 text-foreground">Upcoming Events</h2>
					<Carousel className="w-full">
						<CarouselContent>
							{groupEvents.map((event) => (
								<CarouselItem key={event._id} className="md:basis-1/2 lg:basis-1/3">
									<Card className="overflow-hidden">
										<Link href={`/events/${event._id}`}>
											<div className="relative h-48 group">
												<Image
													src={event.eventImage}
													alt={event.eventName}
													fill
													className="object-cover transition-transform duration-300 group-hover:scale-105"
												/>
											</div>
										</Link>
										<div className="p-6">
											<Link href={`/events/${event._id}`}>
												<h3 className="text-xl font-semibold text-foreground hover:text-primary transition-colors duration-200">
													{event.eventName}
												</h3>
											</Link>
											<div className="flex items-center justify-between mb-4">
												<Badge variant="secondary" className="bg-primary/10 text-primary">
													{event.eventParticipants} going
												</Badge>
											</div>
											<p className="text-muted-foreground mb-4">{event.eventDesc}</p>
											<div className="space-y-2">
												<div className="flex items-center text-sm text-muted-foreground">
													<Calendar className="h-4 w-4 mr-2" />
													{event.eventDate.toLocaleDateString()} at {event.eventTime}
												</div>
												<div className="flex items-center text-sm text-muted-foreground">
													<Users className="h-4 w-4 mr-2" />
													{event.eventLocation}
												</div>
											</div>
										</div>
									</Card>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</div>

				{/* Comments Section */}
				<div className="mt-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-semibold text-foreground">Comments</h2>
						<Button variant="outline" size="sm" onClick={() => setIsCommentModalOpen(true)}>
							<MessageSquare className="h-4 w-4 mr-2" />
							Add Comment
						</Button>
					</div>

					{/* Add Comment Modal */}
					{isCommentModalOpen && (
						<Card className="mb-6 p-6">
							<div className="space-y-4">
								<Textarea
									placeholder="Write your comment..."
									value={newComment}
									onChange={(e) => setNewComment(e.target.value)}
									className="min-h-[100px]"
								/>
								<div className="flex justify-end space-x-2">
									<Button variant="outline" onClick={() => setIsCommentModalOpen(false)}>
										Cancel
									</Button>
									<Button onClick={handleAddComment} disabled={!newComment.trim()}>
										Post Comment
									</Button>
								</div>
							</div>
						</Card>
					)}

					<div className="space-y-6">
						{groupComments.map((comment) => (
							<Card key={comment._id} className="p-6">
								<div className="flex items-start space-x-4">
									<Avatar className="h-10 w-10">
										<Image
											src={commentAuthors[comment.authorId].avatar}
											alt={commentAuthors[comment.authorId].name}
											fill
											className="object-cover"
										/>
									</Avatar>
									<div className="flex-1">
										<div className="flex items-center justify-between">
											<h4 className="font-medium text-foreground">{commentAuthors[comment.authorId].name}</h4>
											<span className="text-xs text-muted-foreground">{comment.createdAt.toLocaleDateString()}</span>
										</div>
										<p className="mt-2 text-muted-foreground">{comment.content}</p>
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default withBasicLayout(GroupDetailPage);
