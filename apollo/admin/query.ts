import { gql, TypedDocumentNode } from "@apollo/client";
import { Members } from "@/libs/types/member/member";
import { MembersInquiry } from "@/libs/types/member/member.input";
import { Groups } from "@/libs/types/group/group";
import { GroupsInquiry } from "@/libs/types/group/group.input";
import { Events } from "@/libs/types/event/event";
import { EventsInquiry } from "@/libs/types/event/event.input";

/**************************
 *         MEMBER          *
 *************************/

type GetAllMembersByAdminQuery = {
	getAllMembersByAdmin: Members;
};
type GetAllMembersByAdminQueryVariables = {
	input: MembersInquiry;
};
export const GET_ALL_MEMBERS_BY_ADMIN: TypedDocumentNode<
	GetAllMembersByAdminQuery,
	GetAllMembersByAdminQueryVariables
> = gql`
	query GetAllMembersByAdmin($input: MembersInquiry!) {
		getAllMembersByAdmin(input: $input) {
			list {
				_id
				username
				memberEmail
				memberPhone
				memberFullName
				memberType
				memberPoints
				memberDesc
				memberImage
				memberStatus
				emailVerified
				memberLikes
				memberFollowings
				memberFollowers
				memberViews
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         GROUP           *
 *************************/

type GetAllGroupsByAdminQuery = {
	getAllGroupsByAdmin: Groups;
};
type GetAllGroupsByAdminQueryVariables = {
	input: GroupsInquiry;
};
export const GET_ALL_GROUPS_BY_ADMIN: TypedDocumentNode<GetAllGroupsByAdminQuery, GetAllGroupsByAdminQueryVariables> =
	gql`
		query GetAllGroupsByAdmin($input: GroupsInquiry!) {
			getAllGroupsByAdmin(input: $input) {
				list {
					_id
					groupName
					groupDesc
					groupImage
					memberId
					groupCategories
					groupViews
					groupLikes
					memberCount
					createdAt
					updatedAt
				}
				metaCounter {
					total
				}
			}
		}
	`;

/**************************
 *         EVENT           *
 *************************/

type GetAllEventsByAdminQuery = {
	getAllEventsByAdmin: Events;
};
type GetAllEventsByAdminQueryVariables = {
	input: EventsInquiry;
};
export const GET_ALL_EVENTS_BY_ADMIN: TypedDocumentNode<GetAllEventsByAdminQuery, GetAllEventsByAdminQueryVariables> =
	gql`
		query GetAllEventsByAdmin($input: EventsInquiry!) {
			getAllEventsByAdmin(input: $input) {
				list {
					_id
					eventType
					recurrenceId
					eventName
					eventDesc
					eventImages
					eventStartAt
					eventEndAt
					locationType
					eventCity
					eventAddress
					coordinateLatitude
					coordinateLongitude
					eventCapacity
					eventPrice
					eventStatus
					eventCategories
					eventTags
					groupId
					memberId
					origin
					externalId
					externalUrl
					isRealEvent
					attendeeCount
					eventLikes
					eventViews
					createdAt
					updatedAt
					eventCurrency
				}
				metaCounter {
					total
				}
			}
		}
	`;
