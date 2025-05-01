import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Direction } from '@/libs/enums/common.enum';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/libs/components/ui/pagination';
import OrganizerCard from '@/libs/components/common/OrganizerCard';
import { organizers } from '@/data';
import { OrganizersInquiry } from '@/libs/types/member/member.input';
import OrganizersHeader from '@/libs/components/organizer/OrganizersHeader';
import SortAndFilterOrganizers from '@/libs/components/organizer/SortAndFilterOrganizers';

const initialSearch: OrganizersInquiry = {
	page: 1,
	limit: 6,
	sort: 'createdAt',
	direction: Direction.DESC,
	search: {
		text: '',
	},
};

const OrganizersPage = () => {
	const router = useRouter();

	const readUrl = (): OrganizersInquiry => {
		if (router?.query) {
			return {
				page: Math.max(1, Number(router.query.page) || 1),
				limit: Math.max(1, Number(router.query.limit) || 6),
				sort: (router.query.sort as string) || 'createdAt',
				direction: router.query.direction === '1' ? Direction.ASC : Direction.DESC,
				search: {
					text: (router.query.text as string) || '',
				},
			};
		}
		return initialSearch;
	};

	const [organizerSearch, setOrganizerSearch] = useState<OrganizersInquiry>(() => readUrl());

	const updateURL = (newSearch: OrganizersInquiry) => {
		const query: Record<string, string> = {
			page: Math.max(1, newSearch.page).toString(),
			limit: Math.max(1, newSearch.limit).toString(),
			sort: newSearch.sort || 'createdAt',
			direction: newSearch.direction === Direction.ASC ? '1' : '-1',
		};

		if (newSearch.search?.text) {
			query.text = newSearch.search.text;
		}

		router.push({ query }, undefined, { shallow: true });
	};

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			updateURL({ ...organizerSearch, page });
		}
	};

	useEffect(() => {
		const search = readUrl();
		setOrganizerSearch(search);
	}, [router]);

	const totalPages = Math.max(1, Math.ceil(organizers.length / organizerSearch.limit));
	const startPage = Math.max(1, Math.min(organizerSearch.page - 2, totalPages - 4));
	const endPage = Math.min(totalPages, startPage + 4);

	return (
		<div className="bg-background">
			<OrganizersHeader />
			<SortAndFilterOrganizers updateURL={updateURL} organizerSearch={organizerSearch} />

			<div className="max-w-7xl py-10 mx-auto mb-10">
				{/* Organizers Grid */}
				<div>
					{organizers.length > 0 ? (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{organizers
									.slice(
										(organizerSearch.page - 1) * organizerSearch.limit,
										organizerSearch.page * organizerSearch.limit,
									)
									.map((organizer) => (
										<OrganizerCard key={organizer._id} organizer={organizer} />
									))}
							</div>

							{/* Pagination */}
							<div className="mt-8 flex justify-center">
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												onClick={() => handlePageChange(organizerSearch.page - 1)}
												className={
													organizerSearch.page <= 1
														? 'pointer-events-none opacity-50'
														: 'hover:bg-accent hover:text-accent-foreground'
												}
											/>
										</PaginationItem>

										{Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
											<PaginationItem key={page}>
												<PaginationLink
													isActive={organizerSearch.page === page}
													onClick={() => handlePageChange(page)}
													className="hover:bg-accent hover:text-accent-foreground"
												>
													{page}
												</PaginationLink>
											</PaginationItem>
										))}

										<PaginationItem>
											<PaginationNext
												onClick={() => handlePageChange(organizerSearch.page + 1)}
												className={
													organizerSearch.page >= totalPages
														? 'pointer-events-none opacity-50'
														: 'hover:bg-accent hover:text-accent-foreground'
												}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						</>
					) : (
						<div className="text-center py-12">
							<p className="text-muted-foreground">No organizers found. Try adjusting your filters.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default withBasicLayout(OrganizersPage);
