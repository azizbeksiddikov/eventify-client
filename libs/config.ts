import { MemberType } from "./enums/member.enum";

export const NEXT_APP_API_URL = process.env.NEXT_APP_API_URL;
export const NEXT_PUBLIC_API_GRAPHQL_URL = process.env.NEXT_PUBLIC_API_GRAPHQL_URL;

export const eventsSortOptions = [
	{ value: "createdAt", label: "sort_newest" },
	{ value: "eventStartAt", label: "sort_event_date" },
	{ value: "eventPrice", label: "sort_price" },
	{ value: "attendeeCount", label: "sort_popularity" },
];

export const groupsSortOptions = [
	{ value: "createdAt", label: "sort_newest" },
	{ value: "memberCount", label: "sort_members" },
	{ value: "groupViews", label: "sort_views" },
	{ value: "groupLikes", label: "sort_likes" },
];

export const organizersSortOptions = [
	{ value: "createdAt", label: "sort_newest" },
	{ value: "memberFollowers", label: "sort_followers" },
	{ value: "memberEvents", label: "sort_events" },
	{ value: "memberGroups", label: "sort_groups" },
	{ value: "memberRank", label: "sort_rank" },
];

export const imageTypes = ".jpg,.jpeg,.png,image/jpeg,image/png,image/jpg";

export const getMemberTypeColor = (type: MemberType) => {
	switch (type) {
		case MemberType.ORGANIZER:
			return "bg-purple-100 text-purple-800";
		case MemberType.ADMIN:
			return "bg-red-100 text-red-800";
		default:
			return "bg-blue-100 text-blue-800";
	}
};
