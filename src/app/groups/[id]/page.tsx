"use client";

import { useParams } from "next/navigation";
import { useTranslation } from "next-i18next";
import { useApolloClient, useMutation, useQuery, useReactiveVar } from "@apollo/client/react";
import { userVar } from "@/apollo/store";

import ChosenGroupHeader from "@/libs/components/group/ChosenGroupHeader";
import ChosenGroupData from "@/libs/components/group/ChosenGroupData";
import CommentsComponent from "@/libs/components/common/CommentsComponent";
import ChosenGroupOther from "@/libs/components/group/ChosenGroupOther";
import UpcomingEvents from "@/libs/components/common/UpcomingEvents";

import { GET_GROUP } from "@/apollo/user/query";
import { JOIN_GROUP, LEAVE_GROUP, LIKE_TARGET_EVENT, LIKE_TARGET_GROUP } from "@/apollo/user/mutation";
import { joinGroup, leaveGroup, likeEvent, likeGroup } from "@/libs/utils";
import { Group } from "@/libs/types/group/group";
import { CommentGroup } from "@/libs/enums/comment.enum";

const GroupDetailPage = () => {
	const params = useParams();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation("common");

	const groupId = params?.id as string | undefined;

	/** APOLLO REQUESTS **/
	const [likeTargetGroup] = useMutation(LIKE_TARGET_GROUP);
	const [joinTargetGroup] = useMutation(JOIN_GROUP);
	const [leaveTargetGroup] = useMutation(LEAVE_GROUP);
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);

	const { data: getGroupData } = useQuery(GET_GROUP, {
		fetchPolicy: "cache-and-network",
		skip: !groupId,
		variables: { input: groupId || "" },
		notifyOnNetworkStatusChange: true,
	});

	const client = useApolloClient();

	const group = getGroupData?.getGroup as Group | null;

	/** HANDLERS **/
	const likeGroupHandler = async (groupId: string) => {
		likeGroup(user._id, groupId, likeTargetGroup, client.cache);
	};

	const joinGroupHandler = async (groupId: string) => {
		joinGroup(user._id, groupId, joinTargetGroup, t);
	};

	const leaveGroupHandler = async (groupId: string) => {
		leaveGroup(user._id, groupId, leaveTargetGroup, t);
	};

	const likeEventHandler = async (eventId: string) => {
		await likeEvent(user._id, eventId, likeTargetEvent, client.cache);
	};

	if (!groupId) return null;
	if (!group) return null;
	return (
		<div>
			<ChosenGroupHeader />

			<div className="content-container pb-10">
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
					<div className="lg:col-span-3">
						<ChosenGroupData
							userId={user._id}
							group={group}
							likeGroupHandler={likeGroupHandler}
							joinGroupHandler={joinGroupHandler}
							leaveGroupHandler={leaveGroupHandler}
						/>
						{/*  Upcoming group Events */}
						{group?.groupUpcomingEvents && (
							<UpcomingEvents
								events={group.groupUpcomingEvents}
								organizerName={group.groupName}
								likeEventHandler={likeEventHandler}
							/>
						)}
					</div>
					<ChosenGroupOther group={group} />
				</div>

				{/* Comments Section */}
				{group && <CommentsComponent commentRefId={groupId} commentGroup={CommentGroup.GROUP} />}
			</div>
		</div>
	);
};

export default GroupDetailPage;
