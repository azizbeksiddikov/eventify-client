"use client";

import { useParams } from "next/navigation";
import { useTranslation } from "next-i18next";

import { useApolloClient, useMutation, useQuery, useReactiveVar } from "@apollo/client/react";
import { GET_ORGANIZER } from "@/apollo/user/query";
import { LIKE_TARGET_EVENT, LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from "@/apollo/user/mutation";
import { userVar } from "@/apollo/store";

import { Member } from "@/libs/types/member/member";
import { CommentGroup } from "@/libs/enums/comment.enum";

import CommentsComponent from "@/libs/components/common/CommentsComponent";
import UpcomingEvents from "@/libs/components/common/UpcomingEvents";
import OrganizerHeader from "@/libs/components/organizer/OrganizerHeader";
import OrganizerProfile from "@/libs/components/organizer/OrganizerProfile";
import SimilarGroups from "@/libs/components/common/SimilarGroups";

import { followMember, likeEvent, likeMember, unfollowMember } from "@/libs/utils";

const OrganizerDetailPage = () => {
	const params = useParams();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation("common");

	const organizerId = params?.id as string | undefined;

	/** APOLLO */
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);

	const { data: getOrganizerData } = useQuery(GET_ORGANIZER, {
		fetchPolicy: "cache-and-network",
		skip: !organizerId,
		variables: { input: organizerId! }, // Non-null assertion is safe because skip prevents execution when organizerId is null
		notifyOnNetworkStatusChange: true,
	});

	const client = useApolloClient();

	const organizer = getOrganizerData?.getOrganizer as Member | null;

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

	const likeEventHandler = async (eventId: string) => {
		await likeEvent(user._id, eventId, likeTargetEvent, client.cache);
	};

	if (!organizerId) return null;
	if (!organizer) return null;
	return (
		<div>
			<OrganizerHeader />

			<div className="px-4 sm:px-6 md:px-8 lg:px-10 pb-10 max-w-7xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
				<div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-8">
					<div className="lg:col-span-3">
						<OrganizerProfile
							organizer={organizer}
							likeMemberHandler={likeMemberHandler}
							subscribeHandler={subscribeHandler}
							unsubscribeHandler={unsubscribeHandler}
						/>
					</div>
					<div className="lg:col-span-1">
						{organizer?.organizedGroups && organizer.organizedGroups.length > 0 && (
							<SimilarGroups groups={organizer.organizedGroups} text={t("Organizer Groups")} />
						)}
					</div>
				</div>

				{/* Events Section */}
				{organizer?.organizedEvents && organizer.organizedEvents.length > 0 && (
					<UpcomingEvents
						events={organizer.organizedEvents}
						organizerName={organizer.memberFullName}
						likeEventHandler={likeEventHandler}
					/>
				)}

				{/* Comments Section */}
				<CommentsComponent commentRefId={organizer._id} commentGroup={CommentGroup.MEMBER} />
			</div>
		</div>
	);
};

export default OrganizerDetailPage;
