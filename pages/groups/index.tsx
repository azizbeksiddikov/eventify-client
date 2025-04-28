import { useState } from 'react';
import Link from 'next/link';

interface Group {
	id: string;
	name: string;
	description: string;
	image: string;
	membersCount: number;
	eventsCount: number;
	category: string;
}

const GroupsPage = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 6;

	const groups: Group[] = [
		{
			id: '1',
			name: 'Tech Enthusiasts',
			description: 'A group for technology lovers and innovators',
			image: '/images/tech-group.jpg',
			membersCount: 1200,
			eventsCount: 15,
			category: 'Technology',
		},
		{
			id: '2',
			name: 'Food Lovers Club',
			description: 'Join us to explore culinary delights',
			image: '/images/food-group.jpg',
			membersCount: 800,
			eventsCount: 8,
			category: 'Food & Drink',
		},
		{
			id: '3',
			name: 'Sports Fanatics',
			description: 'For all sports enthusiasts',
			image: '/images/sports-group.jpg',
			membersCount: 2000,
			eventsCount: 20,
			category: 'Sports',
		},
		{
			id: '4',
			name: 'Art & Culture',
			description: 'Exploring art, culture, and creativity',
			image: '/images/art-group.jpg',
			membersCount: 1500,
			eventsCount: 12,
			category: 'Arts',
		},
		// Add more groups as needed
	];

	const categories = ['All', 'Technology', 'Food & Beverage', 'Sports', 'Art', 'Music', 'Business', 'Education'];

	const filteredGroups = groups.filter((group) => {
		const matchesSearch =
			group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			group.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = selectedCategory ? group.category === selectedCategory : true;
		return matchesSearch && matchesCategory;
	});

	const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentGroups = filteredGroups.slice(startIndex, startIndex + itemsPerPage);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-extrabold text-gray-900">Groups</h1>
				<Link
					href="/groups/create"
					className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
				>
					Create Group
				</Link>
			</div>

			<div className="mb-8 flex flex-col sm:flex-row gap-4">
				<div className="flex-1">
					<input
						type="text"
						placeholder="Search groups..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>
				<div className="w-full sm:w-48">
					<select
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					>
						<option value="">All Categories</option>
						<option value="Technology">Technology</option>
						<option value="Food & Drink">Food & Drink</option>
						<option value="Sports">Sports</option>
						<option value="Arts">Arts</option>
					</select>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{currentGroups.map((group) => (
					<Link
						key={group.id}
						href={`/groups/${group.id}`}
						className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
					>
						<div className="relative h-48 overflow-hidden rounded-t-lg">
							<img
								src={group.image}
								alt={group.name}
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
							/>
						</div>
						<div className="p-4">
							<h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">{group.name}</h3>
							<p className="mt-1 text-sm text-gray-500">{group.description}</p>
							<div className="mt-4 flex justify-between text-sm text-gray-500">
								<span>{group.membersCount} members</span>
								<span>{group.eventsCount} events</span>
							</div>
						</div>
					</Link>
				))}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="mt-8 flex justify-center">
					<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Previous
						</button>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<button
								key={page}
								onClick={() => handlePageChange(page)}
								className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
									currentPage === page
										? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
										: 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
								}`}
							>
								{page}
							</button>
						))}
						<button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Next
						</button>
					</nav>
				</div>
			)}
		</div>
	);
};

export default GroupsPage;
