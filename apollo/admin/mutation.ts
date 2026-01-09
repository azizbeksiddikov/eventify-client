import { gql, TypedDocumentNode } from "@apollo/client";
import { Member } from "@/libs/types/member/member";
import { MemberUpdateInput } from "@/libs/types/member/member.update";
import { Group } from "@/libs/types/group/group";
import { GroupUpdateInput } from "@/libs/types/group/group.update";
import { Event } from "@/libs/types/event/event";
import { EventUpdateInput } from "@/libs/types/event/event.update";
import { Currency } from "@/libs/types/currency/currency";
import { CurrencyRateInput } from "@/libs/types/currency/currency.input";

/**************************
 *         MEMBER          *
 *************************/

type RemoveMemberByAdminMutation = {
	removeMemberByAdmin: Member;
};
type RemoveMemberByAdminMutationVariables = {
	input: string;
};
export const REMOVE_MEMBER_BY_ADMIN: TypedDocumentNode<
	RemoveMemberByAdminMutation,
	RemoveMemberByAdminMutationVariables
> = gql`
	mutation RemoveMemberByAdmin($input: String!) {
		removeMemberByAdmin(input: $input) {
			_id
			username
			memberEmail
			memberPhone
			memberFullName
			memberType
			memberStatus
			emailVerified
			memberDesc
			memberImage
			memberPoints
			memberLikes
			memberFollowings
			memberFollowers
			memberViews
			memberRank
			memberGroups
			memberEvents
			eventsOrganizedCount
			createdAt
			updatedAt
		}
	}
`;

type UpdateMemberByAdminMutation = {
	updateMemberByAdmin: Member;
};
type UpdateMemberByAdminMutationVariables = {
	input: MemberUpdateInput;
};
export const UPDATE_MEMBER_BY_ADMIN: TypedDocumentNode<
	UpdateMemberByAdminMutation,
	UpdateMemberByAdminMutationVariables
> = gql`
	mutation UpdateEventByAdmin($input: EventUpdateInput!) {
		updateEventByAdmin(input: $input) {
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
	}
`;

/**************************
 *         GROUP           *
 *************************/

type RemoveGroupByAdminMutation = {
	removeGroupByAdmin: Group;
};
type RemoveGroupByAdminMutationVariables = {
	input: string;
};
export const REMOVE_GROUP_BY_ADMIN: TypedDocumentNode<RemoveGroupByAdminMutation, RemoveGroupByAdminMutationVariables> =
	gql`
		mutation RemoveGroupByAdmin($input: String!) {
			removeGroupByAdmin(groupId: $input) {
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
		}
	`;

type UpdateGroupByAdminMutation = {
	updateGroupByAdmin: Group;
};
type UpdateGroupByAdminMutationVariables = {
	input: GroupUpdateInput;
};
export const UPDATE_GROUP_BY_ADMIN: TypedDocumentNode<UpdateGroupByAdminMutation, UpdateGroupByAdminMutationVariables> =
	gql`
		mutation UpdateGroupByAdmin($input: GroupUpdateInput!) {
			updateGroupByAdmin(input: $input) {
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
		}
	`;

/**************************
 *         EVENT           *
 *************************/

type UpdateEventByAdminMutation = {
	updateEventByAdmin: Event;
};
type UpdateEventByAdminMutationVariables = {
	input: EventUpdateInput;
};
export const UPDATE_EVENT_BY_ADMIN: TypedDocumentNode<UpdateEventByAdminMutation, UpdateEventByAdminMutationVariables> =
	gql`
		mutation UpdateEventByAdmin($input: EventUpdateInput!) {
			updateEventByAdmin(input: $input) {
				_id
				eventType
				recurrenceId
				eventName
				eventDesc
				eventImages
				eventStartAt
				eventEndAt
				eventCity
				eventAddress
				eventCapacity
				eventPrice
				eventStatus
				eventCategories
				groupId
				memberId
				origin
				attendeeCount
				eventLikes
				eventViews
				createdAt
				updatedAt
			}
		}
	`;

type RemoveEventByAdminMutation = {
	removeEventByAdmin: Event;
};
type RemoveEventByAdminMutationVariables = {
	input: string;
};
export const REMOVE_EVENT_BY_ADMIN: TypedDocumentNode<RemoveEventByAdminMutation, RemoveEventByAdminMutationVariables> =
	gql`
		mutation RemoveEventByAdmin($input: String!) {
			removeEventByAdmin(eventId: $input) {
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
		}
	`;

/**************************
 *         CURRENCY        *
 *************************/

type UpdateCurrencyRateMutation = {
	updateCurrencyRate: Currency;
};
type UpdateCurrencyRateMutationVariables = {
	input: CurrencyRateInput;
};
export const UPDATE_CURRENCY_RATE: TypedDocumentNode<
	UpdateCurrencyRateMutation,
	UpdateCurrencyRateMutationVariables
> = gql`
	mutation UpdateCurrencyRate($input: CurrencyRateInput!) {
		updateCurrencyRate(input: $input) {
			currencyCode
			currencyName
			exchangeRate
			symbol
			updatedAt
		}
	}
`;
