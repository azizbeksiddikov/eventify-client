import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Group } from '@/libs/types/group/group';
import { GroupCategory } from '@/libs/enums/group.enum';
import { Direction } from '@/libs/enums/common.enum';
import withBasicLayout from '../../libs/components/layout/LayoutBasic';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/libs/components/ui/pagination';
import GroupCard from '@/libs/components/group/GroupCard';

import { groupList as groups } from '@/data';
import { GroupsInquiry } from '@/libs/types/group/group.input';
import GroupsHeader from '@/libs/components/group/GroupsHeader';
import SortAndFilterGroups from '@/libs/components/group/SortAndFilterGroups';
import CategoriesSidebarGroup from '@/libs/components/group/CategoriesSidebarGroup';

const initialSearch: GroupsInquiry = {
	page: 1,
	limit: 6,
	sort: 'createdAt',
	direction: Direction.DESC,
	search: {
		text: '',
		groupCategories: [],
	},
};

const GroupsPage = () => {
	const router = useRouter();

	const readUrl = (): GroupsInquiry => {
		if (router?.query) {
			console.log(router.query);
			const categories =
				(router.query.categories as string)
					?.split('-')
					.filter(Boolean)
					.map((category) => category.toUpperCase() as GroupCategory)
					.filter((category) => Object.values(GroupCategory).includes(category)) || [];

			return {
				page: Math.max(1, Number(router.query.page) || 1),
				limit: Math.max(1, Number(router.query.limit) || 6),
				sort: (router.query.sort as keyof Group) || 'createdAt',
				direction: router.query.direction === '1' ? Direction.ASC : Direction.DESC,
				search: {
					text: (router.query.text as string) || '',
					groupCategories: categories,
				},
			};
		}
		return initialSearch;
	};

	const [groupSearch, setGroupSearch] = useState<GroupsInquiry>(() => readUrl());

	const updateURL = (newSearch: GroupsInquiry) => {
		const query: Record<string, string> = {
			page: Math.max(1, newSearch.page).toString(),
			limit: Math.max(1, newSearch.limit).toString(),
			sort: newSearch.sort || 'createdAt',
			direction: newSearch.direction === Direction.ASC ? '1' : '-1',
		};

		if (newSearch.search?.text) {
			query.text = newSearch.search.text;
		}
		if (newSearch.search?.groupCategories?.length) {
			query.categories = newSearch.search.groupCategories.join('-');
		}

		router.push({ query }, undefined, { shallow: true });
	};

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			updateURL({ ...groupSearch, page });
		}
	};

	useEffect(() => {
		const search = readUrl();
		setGroupSearch(search);
	}, [router]);

	const totalPages = Math.max(1, Math.ceil(groups.length / groupSearch.limit));
	const startPage = Math.max(1, Math.min(groupSearch.page - 2, totalPages - 4));
	const endPage = Math.min(totalPages, startPage + 4);

	return (
		<div>
			<GroupsHeader />
			<SortAndFilterGroups updateURL={updateURL} groupSearch={groupSearch} />

			<div className="max-w-7xl py-10 mx-auto mb-10">
				<div className="flex flex-row gap-8">
					{/* Categories Sidebar */}
					<CategoriesSidebarGroup groupSearch={groupSearch} updateURL={updateURL} initialSearch={initialSearch} />

					{/* Groups Grid */}
					<div className="flex-1">
						{groups.length > 0 ? (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{groups
										.slice((groupSearch.page - 1) * groupSearch.limit, groupSearch.page * groupSearch.limit)
										.map((group) => (
											<GroupCard key={group._id} group={group} />
										))}
								</div>

								{/* Pagination */}
								<div className="mt-8 flex justify-center">
									<Pagination>
										<PaginationContent>
											<PaginationItem>
												<PaginationPrevious
													onClick={() => handlePageChange(groupSearch.page - 1)}
													className={groupSearch.page <= 1 ? 'pointer-events-none opacity-50' : ''}
												/>
											</PaginationItem>

											{Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
												<PaginationItem key={page}>
													<PaginationLink isActive={groupSearch.page === page} onClick={() => handlePageChange(page)}>
														{page}
													</PaginationLink>
												</PaginationItem>
											))}

											<PaginationItem>
												<PaginationNext
													onClick={() => handlePageChange(groupSearch.page + 1)}
													className={groupSearch.page >= totalPages ? 'pointer-events-none opacity-50' : ''}
												/>
											</PaginationItem>
										</PaginationContent>
									</Pagination>
								</div>
							</>
						) : (
							<div className="text-center py-12">
								<p className="text-muted-foreground">No events found. Try adjusting your filters.</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
export default withBasicLayout(GroupsPage);
