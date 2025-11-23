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

			<div className="mx-auto pb-6 sm:pb-8 md:pb-10 max-w-7xl">
				<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
					<OrganizerProfile
						organizer={organizer}
						likeMemberHandler={likeMemberHandler}
						subscribeHandler={subscribeHandler}
						unsubscribeHandler={unsubscribeHandler}
					/>
					{organizer?.organizedGroups && organizer.organizedGroups.length > 0 && (
						<SimilarGroups groups={organizer.organizedGroups} text={t("Organizer Groups")} />
					)}
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
