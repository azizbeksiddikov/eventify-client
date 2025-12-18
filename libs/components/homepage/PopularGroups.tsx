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
	const { t } = useTranslation("common");

	/** APOLLO */

	const { data: popularGroups, loading } = useQuery(GET_GROUPS, {
		fetchPolicy: "cache-and-network",
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
	});

	const groups: Group[] = popularGroups?.getGroups?.list || [];

	return (
		<section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-muted w-full">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
				<div className="flex flex-row items-center justify-start gap-3 mb-6 sm:mb-8">
					<h2 className="text-foreground">{t("Popular Groups")}</h2>

					<Button
						type="submit"
						onClick={() => router.push("/event")}
						className="shrink-0 h-9 sm:h-10 md:h-12 px-3 sm:px-4 md:px-6"
					>
						<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
					</Button>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
					{loading
						? [1, 2, 3, 4].map((index) => (
								<div
									key={index}
									className="bg-card rounded-xl shadow-sm overflow-hidden animate-pulse border border-border/50"
								>
									<div className="aspect-video w-full bg-muted"></div>
									<div className="p-4 space-y-3">
										<div className="h-5 bg-muted rounded w-3/4"></div>
										<div className="flex gap-2">
											<div className="h-4 bg-muted rounded w-16"></div>
											<div className="h-4 bg-muted rounded w-20"></div>
										</div>
										<div className="grid grid-cols-3 gap-2 p-2 bg-muted/50 rounded-lg">
											<div className="h-8 bg-muted rounded"></div>
											<div className="h-8 bg-muted rounded"></div>
											<div className="h-8 bg-muted rounded"></div>
										</div>
										<div className="h-12 bg-muted rounded"></div>
									</div>
									<div className="p-4 border-t flex gap-2">
										<div className="h-7 bg-muted rounded flex-1"></div>
										<div className="h-7 bg-muted rounded flex-1"></div>
										<div className="h-7 bg-muted rounded w-16"></div>
									</div>
								</div>
							))
						: groups && groups.map((group) => <GroupCard key={group._id} group={group} />)}
				</div>
			</div>
		</section>
	);
};

export default PopularGroups;
