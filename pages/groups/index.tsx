import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Group } from '@/libs/types/group/group';
import { GroupCategory } from '@/libs/enums/group.enum';
import { Direction } from '@/libs/enums/common.enum';
import withBasicLayout from '../../libs/components/layout/LayoutBasic';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '../../components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GroupCard } from '@/libs/components/group/GroupCard';

const groups: Group[] = [
	{
		_id: '1',
		groupLink: '/groups/1',
		groupName: 'Tech Enthusiasts',
		groupDesc: 'A community for technology enthusiasts to share and learn.',
		groupImage: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
		groupOwnerId: 'owner1',
		groupCategories: [GroupCategory.TECHNOLOGY],
		groupViews: 1000,
		groupLikes: 500,
		memberCount: 150,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: '2',
		groupLink: '/groups/2',
		groupName: 'Business Network',
		groupDesc: 'Connect with professionals and grow your business network.',
		groupImage: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
		groupOwnerId: 'owner2',
		groupCategories: [GroupCategory.BUSINESS],
		groupViews: 800,
		groupLikes: 400,
		memberCount: 200,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: '3',
		groupLink: '/groups/3',
		groupName: 'Art & Design',
		groupDesc: 'A creative space for artists and designers.',
		groupImage: 'https://images.pexels.com/photos/1704120/pexels-photo-1704120.jpeg',
		groupOwnerId: 'owner3',
		groupCategories: [GroupCategory.ART],
		groupViews: 600,
		groupLikes: 300,
		memberCount: 120,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: '4',
		groupLink: '/groups/4',
		groupName: 'Health & Wellness',
		groupDesc: 'Promoting healthy living and wellness practices.',
		groupImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
		groupOwnerId: 'owner4',
		groupCategories: [GroupCategory.HEALTH],
		groupViews: 900,
		groupLikes: 450,
		memberCount: 180,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: '5',
		groupLink: '/groups/5',
		groupName: 'Education Hub',
		groupDesc: 'Learning and sharing knowledge across various subjects.',
		groupImage: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
		groupOwnerId: 'owner5',
		groupCategories: [GroupCategory.EDUCATION],
		groupViews: 1200,
		groupLikes: 600,
		memberCount: 250,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: '6',
		groupLink: '/groups/6',
		groupName: 'Entertainment Club',
		groupDesc: 'For those who love movies, music, and entertainment.',
		groupImage: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg',
		groupOwnerId: 'owner6',
		groupCategories: [GroupCategory.ENTERTAINMENT],
		groupViews: 1500,
		groupLikes: 750,
		memberCount: 300,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

const sortOptions = [
	{ value: 'createdAt', label: 'Newest' },
	{ value: 'memberCount', label: 'Members' },
	{ value: 'groupViews', label: 'Views' },
	{ value: 'groupLikes', label: 'Likes' },
];

interface GroupsSearch {
	text: string;
	groupCategories: GroupCategory[];
}

interface GroupsInquiry {
	search: GroupsSearch;
	page: number;
	limit: number;
	sort: keyof Group;
	direction: Direction;
}

const initialSearch: GroupsInquiry = {
	search: {
		text: '',
		groupCategories: [],
	},
	page: 1,
	limit: 12,
	sort: 'createdAt',
	direction: Direction.DESC,
};

const GroupsPage = () => {
	const router = useRouter();
	const [searchParams, setSearchParams] = useState<GroupsInquiry>(() => {
		if (router?.query) {
			return {
				search: {
					text: (router.query.text as string) || '',
					groupCategories:
						(router.query.categories as string)
							?.split(',')
							.filter(Boolean)
							.map((cat) => cat.toUpperCase() as GroupCategory)
							.filter((cat) => Object.values(GroupCategory).includes(cat)) || [],
				},
				page: Number(router.query.page) || 1,
				limit: Number(router.query.limit) || 12,
				sort: (router.query.sort as keyof Group) || 'createdAt',
				direction: router.query.direction === 'asc' ? Direction.ASC : Direction.DESC,
			};
		}
		return initialSearch;
	});

	const [searchText, setSearchText] = useState(searchParams.search.text);
	const [selectedCategories, setSelectedCategories] = useState<GroupCategory[]>(searchParams.search.groupCategories);

	const updateURL = (newSearch: GroupsInquiry) => {
		const query: Record<string, string> = {
			page: newSearch.page.toString(),
			limit: newSearch.limit.toString(),
			sort: newSearch.sort || 'createdAt',
			direction: newSearch.direction === Direction.ASC ? 'asc' : 'desc',
		};

		if (newSearch.search?.text) {
			query.text = newSearch.search.text;
		}
		if (newSearch.search?.groupCategories?.length) {
			query.categories = newSearch.search.groupCategories.join('-');
		}

		router.push({ query }, undefined, { shallow: true });
	};

	const handleSearch = () => {
		const newSearch = {
			...searchParams,
			page: 1,
			search: {
				...searchParams.search,
				text: searchText,
			},
		};
		setSearchParams(newSearch);
		updateURL(newSearch);
	};

	const handleCategoryChange = (category: GroupCategory) => {
		const newCategories = selectedCategories.includes(category)
			? selectedCategories.filter((cat) => cat !== category)
			: [...selectedCategories, category];

		setSelectedCategories(newCategories);
		const newSearch = {
			...searchParams,
			page: 1,
			search: {
				...searchParams.search,
				groupCategories: newCategories,
			},
		};
		setSearchParams(newSearch);
		updateURL(newSearch);
	};

	const handlePageChange = (page: number) => {
		const newSearch = { ...searchParams, page };
		setSearchParams(newSearch);
		updateURL(newSearch);
	};

	const handleSortChange = (value: string) => {
		const newSearch = { ...searchParams, sort: value as keyof Group };
		setSearchParams(newSearch);
		updateURL(newSearch);
	};

	const toggleDirection = () => {
		const newSearch = {
			...searchParams,
			direction: searchParams.direction === Direction.ASC ? Direction.DESC : Direction.ASC,
		};
		setSearchParams(newSearch);
		updateURL(newSearch);
	};

	return (
		<div className="min-h-screen bg-background py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header Section */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
					<div>
						<h1 className="text-4xl font-semibold tracking-tight text-foreground">Discover Groups</h1>
						<p className="text-muted-foreground mt-2 text-lg">Find and join communities that match your interests</p>
					</div>
					<Link href="/groups/create">
						<Button className="w-full md:w-auto bg-primary hover:bg-primary/90">Create Group</Button>
					</Link>
				</div>

				{/* Search and Filter Section */}
				<div className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-sm border border-border/50 p-6 mb-8">
					<div className="flex flex-wrap items-center gap-4">
						<div className="flex-1 min-w-[200px]">
							<Input
								placeholder="Search groups..."
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								className="bg-background/50 backdrop-blur-sm"
							/>
						</div>
						<Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
							<Search className="h-4 w-4 mr-2" />
							Search
						</Button>
						<Select value={searchParams.sort} onValueChange={handleSortChange}>
							<SelectTrigger className="w-[180px] bg-background/50 backdrop-blur-sm">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								{sortOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							variant="outline"
							size="icon"
							onClick={toggleDirection}
							className="bg-background/50 backdrop-blur-sm"
						>
							{searchParams.direction === Direction.ASC ? '↑' : '↓'}
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								setSearchText('');
								setSelectedCategories([]);
								setSearchParams(initialSearch);
								updateURL(initialSearch);
							}}
							className="bg-background/50 backdrop-blur-sm"
						>
							Clear Filters
						</Button>
					</div>
				</div>

				{/* Categories Section */}
				<div className="mb-8">
					<div className="flex flex-wrap gap-2">
						{Object.values(GroupCategory).map((category) => (
							<Button
								key={category}
								variant={selectedCategories.includes(category) ? 'default' : 'outline'}
								onClick={() => handleCategoryChange(category)}
								className="rounded-full"
							>
								{category}
							</Button>
						))}
					</div>
				</div>

				{/* Groups Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{groups.length === 0 ? (
						<div className="col-span-full text-center py-12">
							<h3 className="text-lg font-medium text-muted-foreground">No groups found</h3>
							<p className="text-sm text-muted-foreground mt-2">
								Try adjusting your search or filters to find what you're looking for
							</p>
						</div>
					) : (
						groups.map((group) => (
							<div key={group._id} className="col-span-1">
								<GroupCard group={group} onJoin={() => {}} isJoined={false} />
							</div>
						))
					)}
				</div>

				{/* Pagination */}
				<div className="mt-8 flex justify-center">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() => handlePageChange(searchParams.page - 1)}
									className={searchParams.page <= 1 ? 'pointer-events-none opacity-50' : ''}
								/>
							</PaginationItem>

							{Array.from({ length: 3 }, (_, i) => searchParams.page + i - 1)
								.filter((page) => page > 0)
								.map((page) => (
									<PaginationItem key={page}>
										<PaginationLink isActive={searchParams.page === page} onClick={() => handlePageChange(page)}>
											{page}
										</PaginationLink>
									</PaginationItem>
								))}

							<PaginationItem>
								<PaginationNext
									onClick={() => handlePageChange(searchParams.page + 1)}
									className={
										searchParams.page === Math.ceil(groups.length / searchParams.limit)
											? 'pointer-events-none opacity-50'
											: ''
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		</div>
	);
};

export default withBasicLayout(GroupsPage);
