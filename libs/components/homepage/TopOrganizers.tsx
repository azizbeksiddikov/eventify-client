import { userVar } from "@/apollo/store";
import { ArrowRight } from "lucide-react";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";

import { Button } from "@/libs/components/ui/button";
import OrganizerCard from "@/libs/components/common/OrganizerCard";

import { GET_ORGANIZERS } from "@/apollo/user/query";
import { LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from "@/apollo/user/mutation";
import { Member } from "@/libs/types/member/member";
import { OrganizersInquiry } from "@/libs/types/member/member.input";
import { Direction } from "@/libs/enums/common.enum";
import { followMember, likeMember, unfollowMember } from "@/libs/utils";
import Loading from "../common/Loading";

interface TopOrganizersProps {
	initialInput?: OrganizersInquiry;
}

const TopOrganizers = ({
	initialInput = {
		page: 1,
		limit: 4,
		sort: "memberRank",
		direction: Direction.DESC,
		search: {},
	},
}: TopOrganizersProps) => {
	const { t } = useTranslation("home");
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** APOLLO */
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);

	const { data: organizersData, loading } = useQuery(GET_ORGANIZERS, {
		fetchPolicy: "cache-and-network",
		variables: {
			input: initialInput,
		},
		notifyOnNetworkStatusChange: true,
	});
	const organizers: Member[] = organizersData?.getOrganizers?.list || [];

	/** HANDLERS */
	const likeMemberHandler = async (memberId: string) => {
		likeMember(user._id, memberId, likeTargetMember);
	};

	const subscribeHandler = async (memberId: string) => {
		followMember(user._id, memberId, subscribe, t);
	};

	const unsubscribeHandler = async (memberId: string) => {
		unfollowMember(user._id, memberId, unsubscribe, t);
	};

	return (
		<section className="bg-secondary/50 py-8 sm:py-12 md:py-16 lg:py-20 w-full">
			<div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
				<div className="flex flex-row items-center justify-start gap-3 mb-6 sm:mb-8">
					<h2 className="text-foreground">{t("top_organizers")}</h2>
					<Button
						type="submit"
						onClick={() => router.push("/organizers")}
						className="shrink-0 h-9 sm:h-10 md:h-12 px-3 sm:px-4 md:px-6 bg-card text-card-foreground hover:bg-card/90"
					>
						<ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
					</Button>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
					{loading ? (
						<Loading />
					) : organizers.length === 0 ? (
						<div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
							<p className="text-muted-foreground">{t("no_top_organizers_found")}</p>
						</div>
					) : (
						organizers.map((organizer) => (
							<OrganizerCard
								key={organizer._id}
								organizer={organizer}
								likeMemberHandler={likeMemberHandler}
								subscribeHandler={subscribeHandler}
								unsubscribeHandler={unsubscribeHandler}
							/>
						))
					)}
				</div>
			</div>
		</section>
	);
};

export default TopOrganizers;
