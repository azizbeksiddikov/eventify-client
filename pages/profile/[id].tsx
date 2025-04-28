import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MemberInput, MemberStats, MemberActivity } from '@/libs/types/member/member.input';
import Image from 'next/image';
import { Button } from '@/libs/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/libs/components/ui/card';
import {
	Calendar,
	Users,
	MapPin,
	Clock,
	Edit,
	Mail,
	Phone,
	Globe,
	Facebook,
	Twitter,
	Instagram,
	Linkedin,
} from 'lucide-react';

const ProfilePage = () => {
	const router = useRouter();
	const { id } = router.query;
	const [member, setMember] = useState<MemberInput | null>(null);
	const [stats, setStats] = useState<MemberStats | null>(null);
	const [activity, setActivity] = useState<MemberActivity | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [isCurrentUser, setIsCurrentUser] = useState(false);

	useEffect(() => {
		if (id) {
			fetchProfileData();
		}
	}, [id]);

	const fetchProfileData = async () => {
		setIsLoading(true);
		try {
			// TODO: Replace with actual API calls
			const mockMember: MemberInput = {
				id: id as string,
				email: 'john.doe@example.com',
				firstName: 'John',
				lastName: 'Doe',
				phoneNumber: '+1 (555) 123-4567',
				profileImage: '/images/profiles/john-doe.jpg',
				bio: 'Technology enthusiast and event organizer. Passionate about bringing people together through meaningful experiences.',
				website: 'https://johndoe.com',
				socialMedia: {
					facebook: 'johndoe',
					twitter: 'johndoe',
					instagram: 'johndoe',
					linkedin: 'johndoe',
				},
				memberType: 'ORGANIZER',
				createdAt: new Date('2023-01-01'),
				updatedAt: new Date(),
			};

			const mockStats: MemberStats = {
				eventsAttended: 25,
				eventsOrganized: 10,
				groupsJoined: 5,
				groupsCreated: 2,
			};

			const mockActivity: MemberActivity = {
				recentEvents: [
					{
						id: '1',
						name: 'Web Development Workshop',
						date: new Date('2024-05-15'),
						type: 'organized',
					},
					{
						id: '2',
						name: 'Tech Conference 2024',
						date: new Date('2024-04-20'),
						type: 'attended',
					},
				],
				recentGroups: [
					{
						id: '1',
						name: 'Tech Innovators',
						role: 'organizer',
					},
					{
						id: '2',
						name: 'Web Developers Community',
						role: 'member',
					},
				],
			};

			setMember(mockMember);
			setStats(mockStats);
			setActivity(mockActivity);
			setIsCurrentUser(id === '1'); // TODO: Replace with actual user ID check
		} catch (error) {
			console.error('Failed to fetch profile data:', error);
			setError('Failed to fetch profile data');
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!member) {
		return <div>Profile not found</div>;
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12">
			<div className="max-w-7xl mx-auto px-4">
				{/* Profile Header */}
				<div className="bg-white rounded-lg shadow-sm p-6 mb-8">
					<div className="flex flex-col md:flex-row items-center gap-8">
						<div className="relative w-32 h-32 rounded-full overflow-hidden">
							<Image
								src={member.profileImage || '/images/default-avatar.jpg'}
								alt={`${member.firstName} ${member.lastName}`}
								fill
								className="object-cover"
							/>
						</div>
						<div className="flex-1 text-center md:text-left">
							<h1 className="text-3xl font-bold mb-2">
								{member.firstName} {member.lastName}
							</h1>
							<p className="text-gray-600 mb-4">{member.bio}</p>
							<div className="flex items-center justify-center md:justify-start gap-4">
								{member.socialMedia?.facebook && (
									<a
										href={`https://facebook.com/${member.socialMedia.facebook}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-gray-600 hover:text-blue-600"
									>
										<Facebook className="h-5 w-5" />
									</a>
								)}
								{member.socialMedia?.twitter && (
									<a
										href={`https://twitter.com/${member.socialMedia.twitter}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-gray-600 hover:text-blue-400"
									>
										<Twitter className="h-5 w-5" />
									</a>
								)}
								{member.socialMedia?.instagram && (
									<a
										href={`https://instagram.com/${member.socialMedia.instagram}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-gray-600 hover:text-pink-600"
									>
										<Instagram className="h-5 w-5" />
									</a>
								)}
								{member.socialMedia?.linkedin && (
									<a
										href={`https://linkedin.com/in/${member.socialMedia.linkedin}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-gray-600 hover:text-blue-700"
									>
										<Linkedin className="h-5 w-5" />
									</a>
								)}
								{member.website && (
									<a
										href={member.website}
										target="_blank"
										rel="noopener noreferrer"
										className="text-gray-600 hover:text-blue-600"
									>
										<Globe className="h-5 w-5" />
									</a>
								)}
							</div>
						</div>
						{isCurrentUser && (
							<Button variant="outline" onClick={() => router.push('/profile/edit')}>
								<Edit className="h-4 w-4 mr-2" />
								Edit Profile
							</Button>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="md:col-span-2 space-y-8">
						{/* Contact Information */}
						<Card>
							<CardHeader>
								<CardTitle>Contact Information</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center gap-2">
										<Mail className="h-5 w-5 text-gray-500" />
										<span>{member.email}</span>
									</div>
									{member.phoneNumber && (
										<div className="flex items-center gap-2">
											<Phone className="h-5 w-5 text-gray-500" />
											<span>{member.phoneNumber}</span>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Recent Activity */}
						<Card>
							<CardHeader>
								<CardTitle>Recent Activity</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{activity?.recentEvents.map((event) => (
										<div key={event.id} className="flex items-start gap-4">
											<div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
												<Calendar className="h-6 w-6 text-gray-500" />
											</div>
											<div>
												<h4 className="font-semibold">{event.name}</h4>
												<div className="flex items-center gap-4 text-sm text-gray-500">
													<span>{event.date.toLocaleDateString()}</span>
													<span className="capitalize">{event.type}</span>
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="space-y-8">
						{/* Stats */}
						<Card>
							<CardHeader>
								<CardTitle>Stats</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-4">
									<div className="text-center p-4 bg-gray-50 rounded-lg">
										<div className="text-2xl font-bold">{stats?.eventsAttended}</div>
										<div className="text-sm text-gray-500">Events Attended</div>
									</div>
									<div className="text-center p-4 bg-gray-50 rounded-lg">
										<div className="text-2xl font-bold">{stats?.eventsOrganized}</div>
										<div className="text-sm text-gray-500">Events Organized</div>
									</div>
									<div className="text-center p-4 bg-gray-50 rounded-lg">
										<div className="text-2xl font-bold">{stats?.groupsJoined}</div>
										<div className="text-sm text-gray-500">Groups Joined</div>
									</div>
									<div className="text-center p-4 bg-gray-50 rounded-lg">
										<div className="text-2xl font-bold">{stats?.groupsCreated}</div>
										<div className="text-sm text-gray-500">Groups Created</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Groups */}
						<Card>
							<CardHeader>
								<CardTitle>Groups</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{activity?.recentGroups.map((group) => (
										<div key={group.id} className="flex items-center gap-4">
											<div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
												<Users className="h-5 w-5 text-gray-500" />
											</div>
											<div>
												<h4 className="font-semibold">{group.name}</h4>
												<p className="text-sm text-gray-500 capitalize">{group.role}</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
