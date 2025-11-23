"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useApolloClient, useMutation, useQuery, useReactiveVar } from "@apollo/client/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import OrganizerCard from "@/libs/components/common/OrganizerCard";
import OrganizersHeader from "@/libs/components/organizer/OrganizersHeader";
import SortAndFilterOrganizers from "@/libs/components/organizer/SortAndFilterOrganizers";
import PaginationComponent from "@/libs/components/common/PaginationComponent";

import { GET_ORGANIZERS } from "@/apollo/user/query";
import { SUBSCRIBE, UNSUBSCRIBE, LIKE_TARGET_MEMBER } from "@/apollo/user/mutation";
import { Direction } from "@/libs/enums/common.enum";
import { OrganizersInquiry } from "@/libs/types/member/member.input";
import { Member } from "@/libs/types/member/member";
import { userVar } from "@/apollo/store";
import { followMember, likeMember, unfollowMember } from "@/libs/utils";

interface OrganizersPageProps {
	initialSearch?: OrganizersInquiry;
}

const OrganizersPage = ({
	initialSearch = {
		page: 1,
		limit: 6,
		sort: "createdAt",
		direction: Direction.DESC,
		search: {
			text: "",
		},
	},
}: OrganizersPageProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation("common");

	const readUrl = (): OrganizersInquiry => {
		return {
			page: Math.max(1, Number(searchParams.get("page")) || initialSearch.page),
			limit: Math.max(1, Number(searchParams.get("limit")) || initialSearch.limit),
			sort: searchParams.get("sort") || initialSearch.sort,
			direction: searchParams.get("direction") === "1" ? Direction.ASC : Direction.DESC,
			search: {
				text: searchParams.get("text") || initialSearch.search.text,
			},
		};
	};

	const [organizerSearch, setOrganizerSearch] = useState<OrganizersInquiry>(() => readUrl());

	const updateURL = (newSearch: OrganizersInquiry) => {
		const params = new URLSearchParams();
		params.set("page", Math.max(initialSearch.page, newSearch.page).toString());
		params.set("limit", Math.max(1, newSearch.limit).toString());
		params.set("sort", newSearch.sort || initialSearch.sort || "createdAt");
		params.set("direction", newSearch.direction === Direction.ASC ? "1" : "-1");

		if (newSearch.search?.text) {
			params.set("text", newSearch.search.text);
		}

		router.push(`${pathname}?${params.toString()}`);
	};
	/** APOLLO */
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);

	const { data: organizersData } = useQuery(GET_ORGANIZERS, {
		fetchPolicy: "cache-and-network",
		variables: {
			input: organizerSearch,
		},
		notifyOnNetworkStatusChange: true,
	});
	const client = useApolloClient();
	const organizers: Member[] = organizersData?.getOrganizers?.list || [];

	/** LIFECYCLE */
	useEffect(() => {
		setOrganizerSearch(readUrl());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	/** HANDLERS */
	const likeMemberHandler = async (memberId: string) => {
		likeMember(user._id, memberId, likeTargetMember, client.cache);
	};

	const subscribeHandler = async (memberId: string) => {
		followMember(user._id, memberId, subscribe, t);
	};

	const unsubscribeHandler = async (memberId: string) => {
		unfollowMember(user._id, memberId, unsubscribe, t);
	};

	const pageChangeHandler = (newPage: number) => {
		updateURL({ ...organizerSearch, page: newPage });
	};

	return (
		<div>
			<OrganizersHeader />
			<SortAndFilterOrganizers updateURL={updateURL} organizerSearch={organizerSearch} initialSearch={initialSearch} />

			{/* Organizers Grid */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mb-10">
				{organizers.length > 0 ? (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{organizers.map((organizer) => (
								<OrganizerCard
									key={organizer._id}
									organizer={organizer}
									likeMemberHandler={likeMemberHandler}
									subscribeHandler={subscribeHandler}
									unsubscribeHandler={unsubscribeHandler}
								/>
							))}
						</div>

						{/* Pagination */}
						<div className="mt-10 flex justify-center">
							<PaginationComponent
								totalItems={organizers.length}
								currentPage={organizerSearch.page}
								pageChangeHandler={pageChangeHandler}
							/>
						</div>
					</>
				) : (
					<div className="py-16 text-center">
						<p className="text-muted-foreground">{t("No organizers found. Try adjusting your filters.")}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default OrganizersPage;
