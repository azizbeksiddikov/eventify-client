import { useState, useEffect } from 'react';
import { Button } from '../libs/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../libs/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../libs/components/ui/tabs';
import { Input } from '../libs/components/ui/input';
import { MemberInput, EventInput, CommentInput } from '../libs/types';
import ErrorComponent from '../libs/components/common/ErrorComponent';
import LoadingComponent from '../libs/components/common/LoadingComponent';
import { Search, Trash2, Ban, CheckCircle2, MessageSquare } from 'lucide-react';

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState('members');
	const [searchTerm, setSearchTerm] = useState('');
	const [members, setMembers] = useState<MemberInput[]>([]);
	const [events, setEvents] = useState<EventInput[]>([]);
	const [comments, setComments] = useState<CommentInput[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			// Mock data - replace with actual API calls
			const mockMembers: MemberInput[] = [
				{
					id: '1',
					email: 'user1@example.com',
					firstName: 'John',
					lastName: 'Doe',
					role: 'USER',
					isBlocked: false,
					createdAt: new Date().toISOString(),
				},
				{
					id: '2',
					email: 'user2@example.com',
					firstName: 'Jane',
					lastName: 'Smith',
					role: 'ORGANIZER',
					isBlocked: true,
					createdAt: new Date().toISOString(),
				},
			];

			const mockEvents: EventInput[] = [
				{
					id: '1',
					name: 'Tech Conference 2024',
					description: 'Annual tech conference',
					date: new Date().toISOString(),
					location: 'New York',
					organizerId: '2',
					status: 'UPCOMING',
					attendeesCount: 500,
					createdAt: new Date().toISOString(),
				},
				{
					id: '2',
					name: 'Art Exhibition',
					description: 'Modern art exhibition',
					date: new Date().toISOString(),
					location: 'London',
					organizerId: '2',
					status: 'ONGOING',
					attendeesCount: 300,
					createdAt: new Date().toISOString(),
				},
			];

			const mockComments: CommentInput[] = [
				{
					id: '1',
					content: 'Great event! Looking forward to it.',
					eventId: '1',
					memberId: '1',
					memberName: 'John Doe',
					createdAt: new Date().toISOString(),
					isReported: false,
				},
				{
					id: '2',
					content: 'Inappropriate comment',
					eventId: '2',
					memberId: '2',
					memberName: 'Jane Smith',
					createdAt: new Date().toISOString(),
					isReported: true,
				},
			];

			setMembers(mockMembers);
			setEvents(mockEvents);
			setComments(mockComments);
			setLoading(false);
		} catch (err) {
			setError('Failed to load data');
			setLoading(false);
		}
	};

	const handleBlockMember = async (memberId: string) => {
		try {
			// Mock API call - replace with actual API call
			setMembers(
				members.map((member) => (member.id === memberId ? { ...member, isBlocked: !member.isBlocked } : member)),
			);
		} catch (err) {
			setError('Failed to update member status');
		}
	};

	const handleDeleteMember = async (memberId: string) => {
		if (window.confirm('Are you sure you want to delete this member?')) {
			try {
				// Mock API call - replace with actual API call
				setMembers(members.filter((member) => member.id !== memberId));
			} catch (err) {
				setError('Failed to delete member');
			}
		}
	};

	const handleDeleteEvent = async (eventId: string) => {
		if (window.confirm('Are you sure you want to delete this event?')) {
			try {
				// Mock API call - replace with actual API call
				setEvents(events.filter((event) => event.id !== eventId));
			} catch (err) {
				setError('Failed to delete event');
			}
		}
	};

	const handleDeleteComment = async (commentId: string) => {
		if (window.confirm('Are you sure you want to delete this comment?')) {
			try {
				// Mock API call - replace with actual API call
				setComments(comments.filter((comment) => comment.id !== commentId));
			} catch (err) {
				setError('Failed to delete comment');
			}
		}
	};

	const filteredMembers = members.filter(
		(member) =>
			member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			member.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const filteredEvents = events.filter(
		(event) =>
			event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.location.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const filteredComments = comments.filter(
		(comment) =>
			comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
			comment.memberName.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	if (loading) return <LoadingComponent />;
	if (error) return <ErrorComponent message={error} />;

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

			<div className="mb-6">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
				<TabsList>
					<TabsTrigger value="members">Members</TabsTrigger>
					<TabsTrigger value="events">Events</TabsTrigger>
					<TabsTrigger value="comments">Comments</TabsTrigger>
				</TabsList>

				<TabsContent value="members">
					<Card>
						<CardHeader>
							<CardTitle>Member Management</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{filteredMembers.map((member) => (
									<div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
										<div>
											<h3 className="font-medium">
												{member.firstName} {member.lastName}
											</h3>
											<p className="text-muted-foreground">{member.email}</p>
											<p className="text-sm text-muted-foreground">
												Role: {member.role} • Joined: {new Date(member.createdAt).toLocaleDateString()}
											</p>
										</div>
										<div className="flex gap-2">
											<Button
												variant={member.isBlocked ? 'default' : 'destructive'}
												size="sm"
												onClick={() => handleBlockMember(member.id)}
											>
												{member.isBlocked ? (
													<>
														<CheckCircle2 className="mr-2 h-4 w-4" />
														Unblock
													</>
												) : (
													<>
														<Ban className="mr-2 h-4 w-4" />
														Block
													</>
												)}
											</Button>
											<Button variant="outline" size="sm" onClick={() => handleDeleteMember(member.id)}>
												<Trash2 className="mr-2 h-4 w-4" />
												Delete
											</Button>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="events">
					<Card>
						<CardHeader>
							<CardTitle>Event Management</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{filteredEvents.map((event) => (
									<div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
										<div>
											<h3 className="font-medium">{event.name}</h3>
											<p className="text-muted-foreground">{event.description}</p>
											<p className="text-sm text-muted-foreground">
												{event.location} • {event.attendeesCount} attendees • Status: {event.status}
											</p>
											<p className="text-sm text-muted-foreground">
												Created: {new Date(event.createdAt).toLocaleDateString()}
											</p>
										</div>
										<Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id)}>
											<Trash2 className="mr-2 h-4 w-4" />
											Delete
										</Button>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="comments">
					<Card>
						<CardHeader>
							<CardTitle>Comment Management</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{filteredComments.map((comment) => (
									<div key={comment.id} className="flex items-center justify-between p-4 border rounded-lg">
										<div>
											<div className="flex items-center gap-2">
												<MessageSquare className="h-4 w-4 text-muted-foreground" />
												<h3 className="font-medium">{comment.memberName}</h3>
												{comment.isReported && (
													<span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded">
														Reported
													</span>
												)}
											</div>
											<p className="text-muted-foreground mt-1">{comment.content}</p>
											<p className="text-sm text-muted-foreground">
												Posted: {new Date(comment.createdAt).toLocaleDateString()}
											</p>
										</div>
										<Button variant="outline" size="sm" onClick={() => handleDeleteComment(comment.id)}>
											<Trash2 className="mr-2 h-4 w-4" />
											Delete
										</Button>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default AdminPage;
