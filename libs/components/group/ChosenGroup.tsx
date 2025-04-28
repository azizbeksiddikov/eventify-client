import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GroupInput, GroupCategory, GroupSocialMedia, GroupModerator } from '@/libs/types/group/group.input';
import { EventInput, EventStatus, EventCategory } from '@/libs/types/event/event.input';
import Image from 'next/image';
import { Button } from '@/libs/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { Heart, Users, Calendar, MapPin, Clock, Share2, Settings, Plus, Crown, Shield } from 'lucide-react';

interface ChosenGroupProps {
	groupId: string;
}

const ChosenGroup = ({ groupId }: ChosenGroupProps) => {
	const router = useRouter();
	const [group, setGroup] = useState<GroupInput | null>(null);
	const [events, setEvents] = useState<EventInput[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [isLiked, setIsLiked] = useState(false);
	const [isJoined, setIsJoined] = useState(false);
	const [isOrganizer, setIsOrganizer] = useState(false);

	useEffect(() => {
		fetchGroupData();
	}, [groupId]);

	const fetchGroupData = async () => {
		setIsLoading(true);
		try {
			// TODO: Replace with actual API calls
			const mockGroup: GroupInput = {
				id: groupId,
				name: 'Tech Innovators',
				description:
					'A community of technology enthusiasts and professionals. We organize regular meetups, workshops, and conferences to share knowledge and network with like-minded individuals.',
				image: '/images/groups/tech-innovators.jpg',
				category: GroupCategory.TECHNOLOGY,
				organizerId: '1',
				organizerName: 'John Doe',
				organizerEmail: 'john@techinnovators.com',
				organizerProfileImage: '/images/profiles/john-doe.jpg',
				moderators: [
					{
						id: '2',
						name: 'Jane Smith',
						email: 'jane@techinnovators.com',
						profileImage: '/images/profiles/jane-smith.jpg',
						role: 'ADMIN',
					},
					{
						id: '3',
						name: 'Mike Johnson',
						email: 'mike@techinnovators.com',
						profileImage: '/images/profiles/mike-johnson.jpg',
						role: 'MODERATOR',
					},
				],
				membersCount: 1500,
				eventsCount: 25,
				createdAt: new Date(),
				updatedAt: new Date(),
				socialMedia: {
					website: 'https://techinnovators.com',
					facebook: 'techinnovators',
					twitter: 'techinnovators',
					instagram: 'techinnovators',
					linkedin: 'techinnovators',
				},
			};

			const mockEvents: EventInput[] = [
				{
					id: '1',
					eventName: 'Web Development Workshop',
					eventDesc: 'Learn modern web development techniques and best practices.',
					eventImage: '/images/events/web-dev.jpg',
					eventDate: new Date('2024-05-15'),
					eventStartTime: '10:00',
					eventEndTime: '16:00',
					eventAddress: 'Tech Hub, San Francisco',
					eventCapacity: 50,
					eventPrice: 49.99,
					eventStatus: EventStatus.UPCOMING,
					eventCategories: [EventCategory.TECHNOLOGY],
					groupId: groupId,
					organizerId: '1',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: '2',
					eventName: 'AI & Machine Learning Meetup',
					eventDesc: 'Discussion on the latest trends in AI and machine learning.',
					eventImage: '/images/events/ai-ml.jpg',
					eventDate: new Date('2024-06-20'),
					eventStartTime: '18:00',
					eventEndTime: '21:00',
					eventAddress: 'Innovation Center, San Francisco',
					eventCapacity: 100,
					eventPrice: 0,
					eventStatus: EventStatus.UPCOMING,
					eventCategories: [EventCategory.TECHNOLOGY],
					groupId: groupId,
					organizerId: '1',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			setGroup(mockGroup);
			setEvents(mockEvents);
			setIsOrganizer(mockGroup.organizerId === '1'); // TODO: Replace with actual user ID check
		} catch (error) {
			console.error('Failed to fetch group data:', error);
			setError('Failed to fetch group data');
		} finally {
			setIsLoading(false);
		}
	};

	const handleLike = () => {
		setIsLiked(!isLiked);
	};

	const handleJoin = () => {
		setIsJoined(!isJoined);
	};

	const handleCreateEvent = () => {
		router.push(`/events/create?groupId=${groupId}`);
	};

	const handleShare = () => {
		// TODO: Implement share functionality
		navigator.clipboard.writeText(window.location.href);
	};

	const handleProfileClick = (userId: string) => {
		router.push(`/profile/${userId}`);
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!group) {
		return <div>Group not found</div>;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Group Header */}
			<div className="relative h-64">
				<Image src={group.image} alt={group.name} fill className="object-cover" />
				<div className="absolute inset-0 bg-black bg-opacity-50" />
				<div className="relative h-full flex items-center justify-center">
					<div className="max-w-4xl mx-auto px-4 text-center text-white">
						<h1 className="text-4xl md:text-6xl font-bold mb-4">{group.name}</h1>
						<p className="text-xl mb-8">{group.description}</p>
						<div className="flex items-center justify-center gap-4">
							<Button
								size="lg"
								variant={isJoined ? 'default' : 'outline'}
								onClick={handleJoin}
								className={isJoined ? 'bg-green-600 hover:bg-green-700' : 'bg-white text-black hover:bg-gray-100'}
							>
								{isJoined ? 'Joined' : 'Join Group'}
							</Button>
							<Button variant="ghost" size="lg" onClick={handleLike} className="text-white hover:bg-white/10">
								<Heart className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
							</Button>
							<Button variant="ghost" size="lg" onClick={handleShare} className="text-white hover:bg-white/10">
								<Share2 className="h-6 w-6" />
							</Button>
							{isOrganizer && (
								<Button
									variant="ghost"
									size="lg"
									onClick={() => router.push(`/groups/${groupId}/settings`)}
									className="text-white hover:bg-white/10"
								>
									<Settings className="h-6 w-6" />
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Group Info */}
			<div className="max-w-7xl mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="md:col-span-2">
						<Card>
							<CardHeader>
								<CardTitle>Upcoming Events</CardTitle>
							</CardHeader>
							<CardContent>
								{isOrganizer && (
									<div className="mb-6">
										<Button onClick={handleCreateEvent} className="w-full">
											<Plus className="mr-2 h-4 w-4" />
											Create New Event
										</Button>
									</div>
								)}
								<div className="space-y-4">
									{events.map((event) => (
										<Card key={event.id} className="hover:shadow-lg transition-shadow">
											<div className="flex">
												<div className="w-1/3">
													<Image
														src={event.eventImage}
														alt={event.eventName}
														width={200}
														height={150}
														className="object-cover h-full rounded-l-lg"
													/>
												</div>
												<div className="w-2/3 p-4">
													<h3 className="font-semibold text-lg">{event.eventName}</h3>
													<p className="text-sm text-gray-600 mb-2">{event.eventDesc}</p>
													<div className="flex items-center gap-4 text-sm text-gray-500">
														<div className="flex items-center">
															<Calendar className="h-4 w-4 mr-1" />
															{event.eventDate.toLocaleDateString()}
														</div>
														<div className="flex items-center">
															<Clock className="h-4 w-4 mr-1" />
															{event.eventStartTime} - {event.eventEndTime}
														</div>
														<div className="flex items-center">
															<MapPin className="h-4 w-4 mr-1" />
															{event.eventAddress}
														</div>
													</div>
													<div className="mt-4 flex justify-between items-center">
														<span className="text-lg font-semibold">
															{event.eventPrice === 0 ? 'Free' : `$${event.eventPrice}`}
														</span>
														<Button variant="outline" onClick={() => router.push(`/events/${event.id}`)}>
															View Details
														</Button>
													</div>
												</div>
											</div>
										</Card>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Group Info</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center">
										<Users className="h-5 w-5 mr-2 text-gray-500" />
										<span>{group.membersCount} members</span>
									</div>
									<div className="flex items-center">
										<Calendar className="h-5 w-5 mr-2 text-gray-500" />
										<span>{group.eventsCount} events</span>
									</div>
									{group.socialMedia && (
										<div className="pt-4">
											<h4 className="font-semibold mb-2">Social Media</h4>
											<div className="flex gap-2">
												{group.socialMedia.website && (
													<a
														href={group.socialMedia.website}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-500 hover:underline"
													>
														Website
													</a>
												)}
												{group.socialMedia.facebook && (
													<a
														href={`https://facebook.com/${group.socialMedia.facebook}`}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-500 hover:underline"
													>
														Facebook
													</a>
												)}
												{group.socialMedia.twitter && (
													<a
														href={`https://twitter.com/${group.socialMedia.twitter}`}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-500 hover:underline"
													>
														Twitter
													</a>
												)}
												{group.socialMedia.instagram && (
													<a
														href={`https://instagram.com/${group.socialMedia.instagram}`}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-500 hover:underline"
													>
														Instagram
													</a>
												)}
												{group.socialMedia.linkedin && (
													<a
														href={`https://linkedin.com/company/${group.socialMedia.linkedin}`}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-500 hover:underline"
													>
														LinkedIn
													</a>
												)}
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Group Owner</CardTitle>
							</CardHeader>
							<CardContent>
								<div
									className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
									onClick={() => handleProfileClick(group.organizerId)}
								>
									<div className="relative w-12 h-12 rounded-full overflow-hidden">
										<Image
											src={group.organizerProfileImage || '/images/default-avatar.jpg'}
											alt={group.organizerName}
											fill
											className="object-cover"
										/>
									</div>
									<div>
										<h4 className="font-semibold">{group.organizerName}</h4>
										<p className="text-sm text-gray-500">{group.organizerEmail}</p>
									</div>
									<Crown className="h-5 w-5 text-yellow-500" />
								</div>
							</CardContent>
						</Card>

						{group.moderators.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle>Moderators</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{group.moderators.map((moderator) => (
											<div
												key={moderator.id}
												className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
												onClick={() => handleProfileClick(moderator.id)}
											>
												<div className="relative w-12 h-12 rounded-full overflow-hidden">
													<Image
														src={moderator.profileImage || '/images/default-avatar.jpg'}
														alt={moderator.name}
														fill
														className="object-cover"
													/>
												</div>
												<div>
													<h4 className="font-semibold">{moderator.name}</h4>
													<p className="text-sm text-gray-500">{moderator.email}</p>
												</div>
												<Shield className="h-5 w-5 text-blue-500" />
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}

						<Card>
							<CardHeader>
								<CardTitle>About</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">{group.description}</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChosenGroup;
