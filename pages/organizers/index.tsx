import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { ArrowUpDown, X } from 'lucide-react';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { MemberType } from '@/libs/enums/member.enum';
import { Direction } from '@/libs/enums/common.enum';
import OrganizerCard from '@/libs/components/common/OrganizerCard';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/libs/components/ui/pagination';

const sortOptions = [
	{ value: 'createdAt', label: 'Newest' },
	{ value: 'memberPoints', label: 'Points' },
	{ value: 'memberFollowers', label: 'Followers' },
	{ value: 'memberEvents', label: 'Events' },
];

const OrganizersPage = () => {
	const router = useRouter();
	const [searchText, setSearchText] = useState('');
	const [sortBy, setSortBy] = useState('createdAt');
	const [sortDirection, setSortDirection] = useState<Direction>(Direction.DESC);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 6;

	// Update search text from URL on mount and when URL changes
	useEffect(() => {
		if (router.query.text) {
			setSearchText(router.query.text as string);
		}
		if (router.query.sort) {
			setSortBy(router.query.sort as string);
		}
		if (router.query.direction) {
			setSortDirection(router.query.direction === 'asc' ? Direction.ASC : Direction.DESC);
		}
		if (router.query.page) {
			setCurrentPage(Number(router.query.page));
		}
	}, [router.query]);

	const updateURL = (newParams: Record<string, string>) => {
		const query = { ...router.query, ...newParams };
		router.push({ query }, undefined, { shallow: true });
	};

	const handleSearch = (text: string) => {
		setSearchText(text);
		if (text) {
			updateURL({ text });
		} else {
			const { text: _, ...rest } = router.query;
			router.push({ query: rest }, undefined, { shallow: true });
		}
	};

	const handleClearFilters = () => {
		setSearchText('');
		setSortBy('createdAt');
		setSortDirection(Direction.DESC);
		router.push('/organizers');
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		updateURL({ page: page.toString() });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleSortChange = (value: string) => {
		setSortBy(value);
		updateURL({ sort: value });
	};

	const toggleDirection = () => {
		const newDirection = sortDirection === Direction.ASC ? Direction.DESC : Direction.ASC;
		setSortDirection(newDirection);
		updateURL({ direction: newDirection.toString().toLowerCase() });
	};

	// Mock data - replace with actual API call
	const organizers = [
		{
			_id: '1',
			username: 'johndoe',
			memberEmail: 'john@example.com',
			memberFullName: 'John Doe',
			memberType: MemberType.ORGANIZER,
			memberDesc: 'Event enthusiast and organizer',
			memberImage: 'https://github.com/shadcn.png',
			memberPoints: 100,
			memberLikes: 50,
			memberFollowings: 20,
			memberFollowers: 100,
			memberViews: 500,
			memberEvents: 15,
		},
		{
			_id: '2',
			username: 'janedoe',
			memberEmail: 'jane@example.com',
			memberFullName: 'Jane Doe',
			memberType: MemberType.ORGANIZER,
			memberDesc: 'Community builder and event planner',
			memberImage: 'https://github.com/shadcn.png',
			memberPoints: 80,
			memberLikes: 40,
			memberFollowings: 15,
			memberFollowers: 80,
			memberViews: 400,
			memberEvents: 10,
		},
	];

	// Calculate total pages based on organizers length and itemsPerPage
	const totalPages = Math.ceil(organizers.length / itemsPerPage);
	const startPage = Math.max(1, currentPage - 2);
	const endPage = Math.min(totalPages, startPage + 4);

	return (
		<div className="bg-background">
			<div className="max-w-7xl mx-auto ">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-semibold text-foreground">Organizers</h1>
					<p className="text-muted-foreground mt-2">Discover and connect with event organizers</p>
				</div>

				{/* Search and Filter Section */}
				<div className="mb-8">
					<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
						<div className="relative w-full">
							<Input
								placeholder="Search organizers..."
								value={searchText}
								onChange={(e) => handleSearch(e.target.value)}
								className="pl-9 pr-4"
							/>
						</div>

						<div className="flex items-center gap-2">
							<select
								value={sortBy}
								onChange={(e) => handleSortChange(e.target.value)}
								className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-hidden focus:border-primary/50 focus:ring-0"
							>
								{sortOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
							<Button
								variant="outline"
								size="icon"
								onClick={toggleDirection}
								className="shrink-0 focus:ring-0 focus:border-primary/50"
							>
								<ArrowUpDown className="h-4 w-4" />
							</Button>
							<Button variant="outline" onClick={handleClearFilters} className="focus:ring-0 focus:border-primary/50">
								<X className="h-4 w-4 mr-2" />
								Clear Filters
							</Button>
						</div>
					</div>
				</div>

				{/* Organizers Grid */}
				{organizers.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-muted-foreground">No organizers found. Try adjusting your search or filters.</p>
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{organizers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((organizer) => (
								<OrganizerCard key={organizer._id} organizer={organizer} />
							))}
						</div>

						{/* Pagination */}
						<div className="mt-8 flex justify-center">
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious
											onClick={() => handlePageChange(currentPage - 1)}
											className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
										/>
									</PaginationItem>

									{Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
										<PaginationItem key={page}>
											<PaginationLink isActive={currentPage === page} onClick={() => handlePageChange(page)}>
												{page}
											</PaginationLink>
										</PaginationItem>
									))}

									<PaginationItem>
										<PaginationNext
											onClick={() => handlePageChange(currentPage + 1)}
											className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default withBasicLayout(OrganizersPage);
