import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GroupInput, GroupCategory } from '../../libs/types/group/group.input';

const OrganizerGroupsPage = () => {
	const router = useRouter();
	const [groups, setGroups] = useState<GroupInput[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		// Check if user is an organizer
		const user = JSON.parse(localStorage.getItem('user') || '{}');
		if (user.memberType !== 'ORGANIZER') {
			router.push('/');
			return;
		}

		// Fetch organizer's groups
		fetchGroups();
	}, []);

	const fetchGroups = async () => {
		setIsLoading(true);
		try {
			// TODO: Replace with actual API call
			const mockGroups: GroupInput[] = [
				{
					groupLink: 'tech-enthusiasts',
					groupName: 'Tech Enthusiasts',
					groupDesc: 'A group for technology lovers and innovators',
					groupImage: '/images/groups/tech-group.jpg',
					groupCategories: [GroupCategory.TECHNOLOGY],
				},
			];
			setGroups(mockGroups);
		} catch (err) {
			setError('Failed to fetch groups');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (groupLink: string) => {
		if (!confirm('Are you sure you want to delete this group?')) return;

		setIsLoading(true);
		try {
			// TODO: Replace with actual API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setGroups((prev) => prev.filter((group) => group.groupLink !== groupLink));
		} catch (err) {
			setError('Failed to delete group');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">My Groups</h1>
					<button
						onClick={() => router.push('/organizer/groups/create')}
						className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
					>
						Create Group
					</button>
				</div>

				{error && (
					<div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<p className="text-sm text-red-700">{error}</p>
							</div>
						</div>
					</div>
				)}

				{isLoading ? (
					<div className="flex justify-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{groups.map((group) => (
							<div key={group.groupLink} className="bg-white overflow-hidden shadow rounded-lg">
								<div className="relative h-48">
									<img
										src={group.groupImage}
										alt={group.groupName}
										className="absolute inset-0 w-full h-full object-cover"
									/>
								</div>
								<div className="px-4 py-5 sm:p-6">
									<h3 className="text-lg font-medium text-gray-900">{group.groupName}</h3>
									<p className="mt-1 text-sm text-gray-500">{group.groupDesc}</p>
									<div className="mt-4">
										{group.groupCategories?.map((category) => (
											<span
												key={category}
												className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2"
											>
												{category}
											</span>
										))}
									</div>
									<div className="mt-4 flex justify-end space-x-2">
										<button
											onClick={() => router.push(`/organizer/groups/${group.groupLink}/edit`)}
											className="text-indigo-600 hover:text-indigo-900"
										>
											Edit
										</button>
										<button onClick={() => handleDelete(group.groupLink)} className="text-red-600 hover:text-red-900">
											Delete
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default OrganizerGroupsPage;
