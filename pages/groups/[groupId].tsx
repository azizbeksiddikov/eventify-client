import { useState } from 'react';
import { useRouter } from 'next/router';
import { Group } from '@/libs/types/group/group';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/libs/components/ui/button';
import { Badge } from '@/libs/components/ui/badge';
import { Card } from '@/libs/components/ui/card';
import { Avatar } from '@/libs/components/ui/avatar';
import { Users, Calendar, Heart, Eye, Shield, Crown } from 'lucide-react';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { GroupMember } from '@/libs/types/groupMembers/groupMember';
import { GroupMemberRole, GroupCategory } from '@/libs/enums/group.enum';
import { Comment } from '@/libs/types/comment/comment';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Comments from '@/libs/components/CommentsComponent';
import { CommentGroup } from '@/libs/enums/comment.enum';
import { CommentStatus } from '@/libs/enums/comment.enum';
import { MemberStatus, MemberType } from '@/libs/enums/member.enum';
import { Event } from '@/libs/types/event/event';
import { EventCategory } from '@/libs/enums/event.enum';
import { EventStatus } from '@/libs/enums/event.enum';

const GroupDetailPage = () => {
	const router = useRouter();
	// const { groupId } = router.query;
	const [isLiked, setIsLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(0);
	const [isJoined, setIsJoined] = useState(false);

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

	const similarGroups: Group[] = [
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

	// Mock data for group members
	const groupAdmins: GroupMember[] = [
		{
			_id: '1',
			groupId: '1',
			memberId: 'owner1',
			groupMemberRole: GroupMemberRole.OWNER,
			joinDate: new Date('2024-01-01'),
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01'),
			memberData: {
				_id: 'owner1',
				username: 'johnsmith',
				memberEmail: 'john@example.com',
				memberFullName: 'John Smith',
				memberType: MemberType.ADMIN,
				memberStatus: MemberStatus.ACTIVE,
				emailVerified: true,
				memberImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
				memberPoints: 1000,
				memberLikes: 250,
				memberFollowings: 50,
				memberFollowers: 150,
				memberViews: 500,
				createdAt: new Date('2024-01-01'),
				updatedAt: new Date('2024-01-01'),
			},
		},
		{
			_id: '2',
			groupId: '1',
			memberId: 'mod1',
			groupMemberRole: GroupMemberRole.MODERATOR,
			joinDate: new Date('2024-01-15'),
			createdAt: new Date('2024-01-15'),
			updatedAt: new Date('2024-01-15'),
			memberData: {
				_id: 'mod1',
				username: 'sarahj',
				memberEmail: 'sarah@example.com',
				memberFullName: 'Sarah Johnson',
				memberType: MemberType.ORGANIZER,
				memberStatus: MemberStatus.ACTIVE,
				emailVerified: true,
				memberImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
				memberPoints: 750,
				memberLikes: 180,
				memberFollowings: 35,
				memberFollowers: 90,
				memberViews: 300,
				createdAt: new Date('2024-01-15'),
				updatedAt: new Date('2024-01-15'),
			},
		},
		{
			_id: '3',
			groupId: '1',
			memberId: 'mod2',
			groupMemberRole: GroupMemberRole.MODERATOR,
			joinDate: new Date('2024-02-01'),
			createdAt: new Date('2024-02-01'),
			updatedAt: new Date('2024-02-01'),
			memberData: {
				_id: 'mod2',
				username: 'mikeb',
				memberEmail: 'mike@example.com',
				memberFullName: 'Mike Brown',
				memberType: MemberType.ORGANIZER,
				memberStatus: MemberStatus.ACTIVE,
				emailVerified: true,
				memberImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
				memberPoints: 500,
				memberLikes: 120,
				memberFollowings: 25,
				memberFollowers: 60,
				memberViews: 200,
				createdAt: new Date('2024-02-01'),
				updatedAt: new Date('2024-02-01'),
			},
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

	// Mock data for group comments
	const groupComments: Comment[] = [
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

	const groupEvents: Event[] = [
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
										<h3 className="font-semibold text-foreground">{memberProfiles.owner1.name ?? 'No Name'}</h3>
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
								{groupAdmins
									.filter((member) => member.groupMemberRole === GroupMemberRole.MODERATOR)
									.map((moderator: GroupMember) => (
										<div key={moderator._id} className="flex items-center space-x-4">
											<Avatar className="h-12 w-12">
												<Image
													src={moderator.memberData?.memberImage ?? 'img/default-avatar.png'}
													alt={moderator.memberData?.memberFullName ?? ''}
													fill
													className="object-cover"
												/>
											</Avatar>
											<div>
												<div className="flex items-center gap-2">
													<h3 className="font-medium text-foreground">{moderator.memberData?.memberFullName}</h3>
													<Badge variant="secondary" className="bg-blue-100 text-blue-800">
														<Shield className="h-3 w-3 mr-1" />
														Moderator
													</Badge>
												</div>
												<p className="text-sm text-muted-foreground">{moderator.memberData?.memberDesc}</p>
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
													{event.attendeeCount} going
												</Badge>
											</div>
											<p className="text-muted-foreground mb-4">{event.eventDesc}</p>
											<div className="space-y-2">
												<div className="flex items-center text-sm text-muted-foreground">
													<Calendar className="h-4 w-4 mr-2" />
													{event.eventDate.toLocaleDateString()} at {event.eventDate.toLocaleTimeString()}
												</div>
												<div className="flex items-center text-sm text-muted-foreground">
													<Users className="h-4 w-4 mr-2" />
													{event.eventAddress}
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
				<Comments comments={groupComments} commentRefId={group._id} commentGroup={CommentGroup.GROUP} />
			</div>
		</div>
	);
};

export default withBasicLayout(GroupDetailPage);
