import { useRouter } from "next/navigation";
import { useTranslation } from "next-i18next";
import { useQuery } from "@apollo/client/react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/libs/components/ui/button";
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
	const router = useRouter();
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
			<div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
				<div className="flex flex-row items-center justify-start gap-3 mb-6 sm:mb-8">
					<h2 className="text-foreground">{t("popular_groups")}</h2>

					<Button
						type="submit"
						onClick={() => router.push("/event")}
						className="shrink-0 h-9 sm:h-10 md:h-12 px-3 sm:px-4 md:px-6"
					>
						<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
					</Button>
				</div>

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
