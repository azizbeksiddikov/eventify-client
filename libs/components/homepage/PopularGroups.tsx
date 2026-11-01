import { useTranslation } from "next-i18next";
import { useQuery } from "@apollo/client/react";

import { SectionHeader } from "@/libs/components/common/SectionHeader";
import GroupCard from "@/libs/components/common/GroupCard";

import { GET_GROUPS } from "@/apollo/user/query";
import { GroupsInquiry } from "@/libs/types/group/group.input";
import { Group } from "@/libs/types/group/group";
import { Direction } from "@/libs/enums/common.enum";
import Loading from "../common/Loading";

interface PopularGroupsProps {
	initialInput?: GroupsInquiry;
}

const PopularGroups = ({
	initialInput = {
		page: 1,
		limit: 4,
		sort: "groupViews",
		direction: Direction.DESC,
		search: {},
	},
}: PopularGroupsProps) => {
	const { t } = useTranslation("home");

	/** APOLLO */

	const { data: popularGroups, loading } = useQuery(GET_GROUPS, {
		fetchPolicy: "cache-and-network",
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
	});

	const groups: Group[] = popularGroups?.getGroups?.list || [];

	return (
		<section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-muted w-full">
			<div className="max-w-7xl mx-auto px-4 sm:px-12 lg:px-20">
				<SectionHeader title={t("popular_groups")} href="/groups" />

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
					{loading ? (
						<Loading />
					) : groups.length === 0 ? (
						<div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
							<p className="text-muted-foreground">{t("no_popular_groups_found")}</p>
						</div>
					) : (
						groups.map((group) => <GroupCard key={group._id} group={group} />)
					)}
				</div>
			</div>
		</section>
	);
};

export default PopularGroups;
