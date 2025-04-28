import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../../libs/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../libs/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../libs/components/ui/avatar';
import { Input } from '../../libs/components/ui/input';
import { MemberInput, MemberStats, MemberActivity } from '../../libs/types/member/member.input';
import ErrorComponent from '../../libs/components/common/ErrorComponent';
import LoadingComponent from '../../libs/components/common/LoadingComponent';

const ProfilePage = () => {
	const router = useRouter();
	const [profile, setProfile] = useState<MemberInput | null>(null);
	const [stats, setStats] = useState<MemberStats | null>(null);
	const [activities, setActivities] = useState<MemberActivity[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editedProfile, setEditedProfile] = useState<Partial<MemberInput>>({});

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				// Mock data - replace with actual API call
				const mockProfile: MemberInput = {
					id: '1',
					email: 'user@example.com',
					firstName: 'John',
					lastName: 'Doe',
					phoneNumber: '+1234567890',
					profileImage: 'https://github.com/shadcn.png',
					bio: 'Event enthusiast and organizer',
					website: 'https://example.com',
					socialMedia: {
						twitter: 'https://twitter.com/user',
						facebook: 'https://facebook.com/user',
						instagram: 'https://instagram.com/user',
						linkedin: 'https://linkedin.com/in/user',
					},
				};

				const mockStats: MemberStats = {
					eventsAttended: 15,
					eventsOrganized: 5,
					groupsJoined: 8,
					groupsCreated: 2,
				};

				const mockActivities: MemberActivity[] = [
					{
						id: '1',
						type: 'EVENT_ATTENDED',
						eventId: '1',
						eventName: 'Tech Conference 2024',
						createdAt: new Date().toISOString(),
					},
					{
						id: '2',
						type: 'GROUP_JOINED',
						groupId: '1',
						groupName: 'Tech Enthusiasts',
						createdAt: new Date().toISOString(),
					},
				];

				setProfile(mockProfile);
				setStats(mockStats);
				setActivities(mockActivities);
				setLoading(false);
			} catch (err) {
				setError('Failed to load profile');
				setLoading(false);
			}
		};

		fetchProfile();
	}, []);

	const handleEdit = () => {
		setEditedProfile(profile || {});
		setIsEditing(true);
	};

	const handleSave = () => {
		// Mock save - replace with actual API call
		setProfile({ ...profile, ...editedProfile } as MemberInput);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditedProfile({});
		setIsEditing(false);
	};

	if (loading) return <LoadingComponent />;
	if (error) return <ErrorComponent message={error} />;
	if (!profile) return <ErrorComponent message="Profile not found" />;

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Profile Card */}
				<Card className="md:col-span-2">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>Profile Information</CardTitle>
							{!isEditing ? (
								<Button variant="outline" onClick={handleEdit}>
									Edit Profile
								</Button>
							) : (
								<div className="flex gap-2">
									<Button onClick={handleSave}>Save</Button>
									<Button variant="outline" onClick={handleCancel}>
										Cancel
									</Button>
								</div>
							)}
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-6">
							<div className="flex items-center gap-4">
								<Avatar className="h-20 w-20">
									<AvatarImage src={profile.profileImage} />
									<AvatarFallback>{profile.firstName[0] + profile.lastName[0]}</AvatarFallback>
								</Avatar>
								<div>
									<h2 className="text-2xl font-bold">
										{profile.firstName} {profile.lastName}
									</h2>
									<p className="text-muted-foreground">{profile.email}</p>
								</div>
							</div>

							{isEditing ? (
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<Input
											placeholder="First Name"
											value={editedProfile.firstName}
											onChange={(e) => setEditedProfile({ ...editedProfile, firstName: e.target.value })}
										/>
										<Input
											placeholder="Last Name"
											value={editedProfile.lastName}
											onChange={(e) => setEditedProfile({ ...editedProfile, lastName: e.target.value })}
										/>
									</div>
									<Input
										placeholder="Phone Number"
										value={editedProfile.phoneNumber}
										onChange={(e) => setEditedProfile({ ...editedProfile, phoneNumber: e.target.value })}
									/>
									<Input
										placeholder="Website"
										value={editedProfile.website}
										onChange={(e) => setEditedProfile({ ...editedProfile, website: e.target.value })}
									/>
									<Textarea
										placeholder="Bio"
										value={editedProfile.bio}
										onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
									/>
								</div>
							) : (
								<div className="space-y-4">
									<div>
										<h3 className="font-semibold">Bio</h3>
										<p className="text-muted-foreground">{profile.bio}</p>
									</div>
									<div>
										<h3 className="font-semibold">Contact Information</h3>
										<p className="text-muted-foreground">{profile.phoneNumber}</p>
										<p className="text-muted-foreground">{profile.website}</p>
									</div>
									<div>
										<h3 className="font-semibold">Social Media</h3>
										<div className="flex gap-4 mt-2">
											{Object.entries(profile.socialMedia).map(([platform, url]) => (
												<a
													key={platform}
													href={url}
													target="_blank"
													rel="noopener noreferrer"
													className="text-primary hover:underline"
												>
													{platform}
												</a>
											))}
										</div>
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Stats and Activities */}
				<div className="space-y-8">
					<Card>
						<CardHeader>
							<CardTitle>Statistics</CardTitle>
						</CardHeader>
						<CardContent>
							{stats && (
								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-2xl font-bold">{stats.eventsAttended}</p>
										<p className="text-muted-foreground">Events Attended</p>
									</div>
									<div>
										<p className="text-2xl font-bold">{stats.eventsOrganized}</p>
										<p className="text-muted-foreground">Events Organized</p>
									</div>
									<div>
										<p className="text-2xl font-bold">{stats.groupsJoined}</p>
										<p className="text-muted-foreground">Groups Joined</p>
									</div>
									<div>
										<p className="text-2xl font-bold">{stats.groupsCreated}</p>
										<p className="text-muted-foreground">Groups Created</p>
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{activities.map((activity) => (
									<div key={activity.id} className="flex items-center gap-4">
										<div className="h-2 w-2 rounded-full bg-primary" />
										<div>
											<p className="font-medium">
												{activity.type === 'EVENT_ATTENDED'
													? `Attended ${activity.eventName}`
													: `Joined ${activity.groupName}`}
											</p>
											<p className="text-sm text-muted-foreground">
												{new Date(activity.createdAt).toLocaleDateString()}
											</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
