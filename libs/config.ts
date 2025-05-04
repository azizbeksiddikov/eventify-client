export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;
export const REACT_APP_API_GRAPHQL_URL = `${process.env.REACT_APP_API_GRAPHQL_URL}`;

export const eventsSortOptions = [
	{ value: 'createdAt', label: 'Newest' },
	{ value: 'eventDate', label: 'Event Date' },
	{ value: 'eventPrice', label: 'Price' },
	{ value: 'attendeeCount', label: 'Popularity' },
];

export const groupsSortOptions = [
	{ value: 'createdAt', label: 'Newest' },
	{ value: 'memberCount', label: 'Members' },
	{ value: 'groupViews', label: 'Views' },
	{ value: 'groupLikes', label: 'Likes' },
];

export const organizersSortOptions = [
	{ value: 'createdAt', label: 'Newest' },
	{ value: 'memberFollowers', label: 'Followers' },
	{ value: 'memberEvents', label: 'Events' },
	{ value: 'memberGroups', label: 'Groups' },
	{ value: 'memberRank', label: 'Rank' },
];

export const imageTypes = '.jpg,.jpeg,.png,image/jpeg,image/png,image/jpg,image/webp';
