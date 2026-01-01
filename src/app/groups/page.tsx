"use client";

import { useEffect, useState, useRef } from "react";
import { useQuery } from "@apollo/client/react";
import { useTranslation } from "next-i18next";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import PaginationComponent from "@/libs/components/common/PaginationComponent";
import GroupsHeader from "@/libs/components/group/GroupsHeader";
import SortAndFilterGroups from "@/libs/components/group/SortAndFilterGroups";
import CategoriesSidebarGroup from "@/libs/components/group/CategoriesSidebarGroup";
import GroupCard from "@/libs/components/common/GroupCard";

import { GET_GROUPS } from "@/apollo/user/query";
import { GroupCategory } from "@/libs/enums/group.enum";
import { GroupsInquiry } from "@/libs/types/group/group.input";
import { Direction } from "@/libs/enums/common.enum";
import { Group } from "@/libs/types/group/group";
import Loading from "@/libs/components/common/Loading";

interface GroupsPageProps {
	initialSearch?: GroupsInquiry;
}

const GroupsPage = ({
	initialSearch = {
		page: 1,
		limit: 10,
		sort: "createdAt",
		direction: Direction.DESC,
		search: {
			text: "",
			groupCategories: [],
		},
	},
}: GroupsPageProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { t } = useTranslation("groups");

	const [groups, setGroups] = useState<Group[]>([]);
	const groupsListRef = useRef<HTMLDivElement>(null);

	const readUrl = (): GroupsInquiry => {
		if (searchParams) {
			const categories =
				searchParams
					.get("categories")
					?.split("-")
					.filter(Boolean)
					.map((cat) => cat.toUpperCase() as GroupCategory)
					.filter((cat) => Object.values(GroupCategory).includes(cat)) || [];

			return {
				page: Math.max(1, Number(searchParams.get("page")) || initialSearch.page),
				limit: Math.max(1, Number(searchParams.get("limit")) || initialSearch.limit),
				sort: (searchParams.get("sort") as keyof Group) || initialSearch.sort,
				direction: searchParams.get("direction") === "1" ? Direction.ASC : Direction.DESC,
				search: {
					text: searchParams.get("text") || "",
					groupCategories: categories,
				},
			};
		}
		return initialSearch;
	};

	const [groupsSearchFilters, setGroupsSearchFilters] = useState<GroupsInquiry>(() => readUrl());

	const updateURL = (newSearch: GroupsInquiry) => {
		const params = new URLSearchParams();

		params.set("page", Math.max(1, newSearch.page || initialSearch.page).toString());
		params.set("limit", Math.max(1, newSearch.limit || initialSearch.limit).toString());
		params.set("sort", newSearch.sort || initialSearch.sort || "createdAt");
		params.set("direction", newSearch.direction === Direction.ASC ? "1" : "-1");

		if (newSearch.search?.text) {
			params.set("text", newSearch.search.text);
		}
		if (newSearch.search?.groupCategories?.length) {
			params.set("categories", newSearch.search.groupCategories.join("-"));
		}

		router.push(`${pathname}?${params.toString()}`);
	};

	/* APOLLO REQUESTS */
	const {
		data: getGroupsData,
		loading,
		refetch: getGroupsRefetch,
	} = useQuery(GET_GROUPS, {
		fetchPolicy: "cache-and-network",
		variables: { input: groupsSearchFilters },
		notifyOnNetworkStatusChange: true,
	});

	/** LIFECYCLES **/

	useEffect(() => {
		setGroupsSearchFilters(readUrl());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	useEffect(() => {
		getGroupsRefetch({ input: groupsSearchFilters }).then();
	}, [groupsSearchFilters]);

	useEffect(() => {
		if (getGroupsData) {
			setGroups(getGroupsData?.getGroups?.list);
		}
	}, [getGroupsData]);

	/** HANDLERS */

	const pageChangeHandler = (newPage: number) => {
		setGroupsSearchFilters({ ...groupsSearchFilters, page: newPage });
		if (groupsListRef.current) {
			const header = document.querySelector("header");
			const headerHeight = header ? header.offsetHeight : 80;
			const extraSpacing = 32; // 32px
			const elementPosition = groupsListRef.current.getBoundingClientRect().top + window.pageYOffset;
			const scrollTop = Math.max(0, elementPosition - headerHeight - extraSpacing);
			window.scrollTo({ top: scrollTop, behavior: "smooth" });
		}
	};

	return (
		<div>
			<GroupsHeader />
			<div className="px-6 sm:px-12 lg:px-20">
				<SortAndFilterGroups
					updateURL={updateURL}
					groupsSearchFilters={groupsSearchFilters}
					initialSearch={initialSearch}
				/>
			</div>

			<div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-10 mb-10">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Categories Sidebar */}
					<CategoriesSidebarGroup
						groupsSearchFilters={groupsSearchFilters}
						updateURL={updateURL}
						initialSearch={initialSearch}
					/>

					{/* Events Grid */}
					<div className="flex-1">
						{loading ? (
							<Loading />
						) : groups.length > 0 ? (
							<>
								<div
									ref={groupsListRef}
									className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr"
								>
									{groups.map((group) => (
										<div key={group._id} className="min-w-0 w-full">
											<GroupCard group={group} />
										</div>
									))}
								</div>

								{/* Pagination */}
								<div className="mt-10 flex justify-center">
									<PaginationComponent
										totalItems={getGroupsData?.getGroups?.metaCounter?.[0]?.total ?? 0}
										currentPage={groupsSearchFilters.page}
										pageChangeHandler={pageChangeHandler}
										limit={groupsSearchFilters.limit}
									/>
								</div>
							</>
						) : (
							<div className="py-16 text-center">
								<p className="text-muted-foreground">{t("no_groups_found")}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default GroupsPage;
