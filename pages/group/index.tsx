import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_GROUPS } from '@/apollo/user/query';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { GroupCategory } from '@/libs/enums/group.enum';
import { GroupsInquiry } from '@/libs/types/group/group.input';
import { Direction } from '@/libs/enums/common.enum';
import { Group } from '@/libs/types/group/group';
import PaginationComponent from '@/libs/components/common/PaginationComponent';
import { useRouter } from 'next/router';
import GroupsHeader from '@/libs/components/group/GroupsHeader';
import SortAndFilterGroups from '@/libs/components/group/SortAndFilterGroups';
import CategoriesSidebarGroup from '@/libs/components/group/CategoriesSidebarGroup';
import GroupCard from '@/libs/components/common/GroupCard';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

interface GroupsPageProps {
	initialSearch?: GroupsInquiry;
}

const GroupsPage = ({
	initialSearch = {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {
			text: '',
			groupCategories: [],
		},
	},
}: GroupsPageProps) => {
	const router = useRouter();
	const { t } = useTranslation('common');

	const [groups, setGroups] = useState<Group[]>([]);
	const [totalPages, setTotalPages] = useState<number>(1);

	const readUrl = (): GroupsInquiry => {
		if (router?.query) {
			const categories =
				(router.query.categories as string)
					?.split('-')
					.filter(Boolean)
					.map((cat) => cat.toUpperCase() as GroupCategory)
					.filter((cat) => Object.values(GroupCategory).includes(cat)) || [];

			return {
				page: Math.max(1, Number(router.query.page) || initialSearch.page),
				limit: Math.max(1, Number(router.query.limit) || initialSearch.limit),
				sort: (router.query.sort as keyof Group) || initialSearch.sort,
				direction: router.query.direction === '1' ? Direction.ASC : Direction.DESC,
				search: {
					text: (router.query.text as string) || '',
					groupCategories: categories,
				},
			};
		}
		return initialSearch;
	};

	const [groupsSearchFilters, setGroupsSearchFilters] = useState<GroupsInquiry>(() => readUrl());

	const updateURL = (newSearch: GroupsInquiry) => {
		const query: Record<string, string> = {
			page: Math.max(1, newSearch.page || initialSearch.page).toString(),
			limit: Math.max(1, newSearch.limit || initialSearch.limit).toString(),
			sort: newSearch.sort || initialSearch.sort,
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

	/** APOLLO REQUESTS **/
	const { data: getGroupsData, refetch: getGroupsRefetch } = useQuery(GET_GROUPS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: groupsSearchFilters },
		notifyOnNetworkStatusChange: true,
	});

	/** LIFECYCLES **/

	useEffect(() => {
		setGroupsSearchFilters(readUrl());
	}, [router]);

	useEffect(() => {
		getGroupsRefetch({ inquiry: groupsSearchFilters }).then();
	}, [groupsSearchFilters]);

	useEffect(() => {
		if (getGroupsData) {
			setGroups(getGroupsData?.getGroups?.list);
			setTotalPages(
				Math.max(
					1,
					Math.ceil(getGroupsData?.getGroups?.list.length / (groupsSearchFilters.limit || initialSearch.limit)),
				),
			);
		}
	}, [getGroupsData]);

	/** HANDLERS */

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			updateURL({ ...groupsSearchFilters, page });
		}
	};

	return (
		<div>
			<GroupsHeader />
			<SortAndFilterGroups
				updateURL={updateURL}
				groupsSearchFilters={groupsSearchFilters}
				initialSearch={initialSearch}
			/>

			<div className="max-w-7xl py-10 mx-auto mb-10">
				<div className="flex flex-row gap-8">
					{/* Categories Sidebar */}
					<CategoriesSidebarGroup
						groupsSearchFilters={groupsSearchFilters}
						updateURL={updateURL}
						initialSearch={initialSearch}
					/>

					{/* Events Grid */}
					<div className="flex-1">
						{groups.length > 0 ? (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{groups.map((group) => (
										<GroupCard key={group._id} group={group} />
									))}
								</div>

								{/* Pagination */}
								<div className="mt-8 flex justify-center">
									<PaginationComponent
										totalItems={totalPages}
										currentPage={groupsSearchFilters.page}
										setCurrentPage={handlePageChange}
										limit={groupsSearchFilters.limit}
									/>
								</div>
							</>
						) : (
							<div className="text-center py-12">
								<p className="text-muted-foreground">{t('No events found. Try adjusting your filters.')}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default withBasicLayout(GroupsPage);
