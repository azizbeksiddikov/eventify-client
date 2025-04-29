import { useState } from 'react';
import Link from 'next/link';

interface UserProfile {
	id: string;
	username: string;
	fullName: string;
	email: string;
	bio: string;
	avatar: string;
	memberType: 'USER' | 'ORGANIZER';
	stats: {
		eventsAttended: number;
		eventsOrganized: number;
		groupsJoined: number;
		groupsCreated: number;
	};
}

interface Event {
	id: string;
	title: string;
	image: string;
	date: string;
	location: string;
	status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
}

interface Group {
	id: string;
	name: string;
	image: string;
	membersCount: number;
	eventsCount: number;
}

const MyPage = () => {
	const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'groups' | 'settings'>('overview');

	// Mock data - replace with actual API calls
	const userProfile: UserProfile = {
		id: '1',
		username: 'johndoe',
		fullName: 'John Doe',
		email: 'john@example.com',
		bio: 'Event enthusiast and tech lover. Always looking for new experiences!',
		avatar: '/images/avatars/default.jpg',
		memberType: 'USER',
		stats: {
			eventsAttended: 12,
			eventsOrganized: 3,
			groupsJoined: 5,
			groupsCreated: 2,
		},
	};

	const events: Event[] = [
		{
			id: '1',
			title: 'Summer Music Festival',
			image: '/images/events/music-festival.jpg',
			date: '2024-07-15',
			location: 'Central Park, New York',
			status: 'UPCOMING',
		},
		{
			id: '2',
			title: 'Tech Conference 2024',
			image: '/images/events/tech-conference.jpg',
			date: '2024-08-20',
			location: 'San Francisco, CA',
			status: 'UPCOMING',
		},
	];

	const groups: Group[] = [
		{
			id: '1',
			name: 'Tech Enthusiasts',
			image: '/images/groups/tech-enthusiasts.jpg',
			membersCount: 150,
			eventsCount: 8,
		},
		{
			id: '2',
			name: 'Food Lovers Club',
			image: '/images/groups/food-lovers.jpg',
			membersCount: 200,
			eventsCount: 12,
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'UPCOMING':
				return 'bg-green-100 text-green-800';
			case 'COMPLETED':
				return 'bg-blue-100 text-blue-800';
			case 'CANCELLED':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Profile Header */}
				<div className="bg-white rounded-lg shadow overflow-hidden">
					<div className="relative h-48 bg-indigo-600">
						<div className="absolute -bottom-16 left-8">
							<div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden">
								<img src={userProfile.avatar} alt={userProfile.fullName} className="h-full w-full object-cover" />
							</div>
						</div>
					</div>
					<div className="pt-20 pb-6 px-8">
						<div className="flex justify-between items-start">
							<div>
								<h1 className="text-2xl font-bold text-gray-900">{userProfile.fullName}</h1>
								<p className="text-gray-500">@{userProfile.username}</p>
								<p className="mt-2 text-gray-600">{userProfile.bio}</p>
							</div>
							<button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
								Edit Profile
							</button>
						</div>
					</div>
				</div>

				{/* Stats */}
				<div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
					<div className="bg-white overflow-hidden shadow rounded-lg">
						<div className="p-5">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">Events Attended</dt>
										<dd className="text-lg font-semibold text-gray-900">{userProfile.stats.eventsAttended}</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>
					<div className="bg-white overflow-hidden shadow rounded-lg">
						<div className="p-5">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
										/>
									</svg>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">Events Organized</dt>
										<dd className="text-lg font-semibold text-gray-900">{userProfile.stats.eventsOrganized}</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>
					<div className="bg-white overflow-hidden shadow rounded-lg">
						<div className="p-5">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
										/>
									</svg>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">Groups Joined</dt>
										<dd className="text-lg font-semibold text-gray-900">{userProfile.stats.groupsJoined}</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>
					<div className="bg-white overflow-hidden shadow rounded-lg">
						<div className="p-5">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
										/>
									</svg>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">Groups Created</dt>
										<dd className="text-lg font-semibold text-gray-900">{userProfile.stats.groupsCreated}</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="mt-6">
					<div className="border-b border-gray-200">
						<nav className="-mb-px flex space-x-8">
							<button
								onClick={() => setActiveTab('overview')}
								className={`${
									activeTab === 'overview'
										? 'border-indigo-500 text-indigo-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
							>
								Overview
							</button>
							<button
								onClick={() => setActiveTab('events')}
								className={`${
									activeTab === 'events'
										? 'border-indigo-500 text-indigo-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
							>
								Events
							</button>
							<button
								onClick={() => setActiveTab('groups')}
								className={`${
									activeTab === 'groups'
										? 'border-indigo-500 text-indigo-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
							>
								Groups
							</button>
							<button
								onClick={() => setActiveTab('settings')}
								className={`${
									activeTab === 'settings'
										? 'border-indigo-500 text-indigo-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
							>
								Settings
							</button>
						</nav>
					</div>
				</div>

				{/* Tab Content */}
				<div className="mt-6">
					{activeTab === 'overview' && (
						<div className="bg-white shadow rounded-lg p-6">
							<h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
							<div className="mt-4 space-y-4">
								{events.map((event) => (
									<div key={event.id} className="flex items-start space-x-4">
										<div className="flex-shrink-0">
											<img src={event.image} alt={event.title} className="h-16 w-16 rounded-lg object-cover" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-900">{event.title}</p>
											<p className="text-sm text-gray-500">{event.location}</p>
											<p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
										</div>
										<div className="flex-shrink-0">
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}
											>
												{event.status}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'events' && (
						<div className="bg-white shadow rounded-lg p-6">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-lg font-medium text-gray-900">My Events</h2>
								<Link
									href="/events/create"
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
								>
									Create Event
								</Link>
							</div>
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
								{events.map((event) => (
									<div key={event.id} className="bg-white rounded-lg shadow overflow-hidden">
										<div className="relative h-48">
											<img
												src={event.image}
												alt={event.title}
												className="absolute inset-0 w-full h-full object-cover"
											/>
										</div>
										<div className="p-4">
											<h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
											<p className="mt-1 text-sm text-gray-500">{event.location}</p>
											<p className="mt-1 text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
											<div className="mt-4">
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}
												>
													{event.status}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'groups' && (
						<div className="bg-white shadow rounded-lg p-6">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-lg font-medium text-gray-900">My Groups</h2>
								<Link
									href="/groups/create"
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
								>
									Create Group
								</Link>
							</div>
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
								{groups.map((group) => (
									<div key={group.id} className="bg-white rounded-lg shadow overflow-hidden">
										<div className="relative h-48">
											<img src={group.image} alt={group.name} className="absolute inset-0 w-full h-full object-cover" />
										</div>
										<div className="p-4">
											<h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
											<div className="mt-4 flex items-center justify-between text-sm text-gray-500">
												<div className="flex items-center">
													<svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
														/>
													</svg>
													{group.membersCount} members
												</div>
												<div className="flex items-center">
													<svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
														/>
													</svg>
													{group.eventsCount} events
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'settings' && (
						<div className="bg-white shadow rounded-lg p-6">
							<h2 className="text-lg font-medium text-gray-900">Account Settings</h2>
							<div className="mt-6 space-y-6">
								<div>
									<label htmlFor="email" className="block text-sm font-medium text-gray-700">
										Email
									</label>
									<div className="mt-1">
										<input
											type="email"
											name="email"
											id="email"
											value={userProfile.email}
											className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
											readOnly
										/>
									</div>
								</div>
								<div>
									<label htmlFor="memberType" className="block text-sm font-medium text-gray-700">
										Account Type
									</label>
									<div className="mt-1">
										<input
											type="text"
											name="memberType"
											id="memberType"
											value={userProfile.memberType}
											className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
											readOnly
										/>
									</div>
								</div>
								<div>
									<button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
										Change Password
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default MyPage;
