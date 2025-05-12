import { makeVar } from '@apollo/client';

import { CustomJwtPayload } from '@/libs/types/customJwtPayload';
export const themeVar = makeVar({});

export const userVar = makeVar<CustomJwtPayload>({
	_id: '',
	username: '',
	memberEmail: '',
	memberPhone: '',
	memberFullName: '',
	memberType: '',
	memberStatus: '',
	emailVerified: false,
	memberDesc: '',
	memberImage: '',
	memberPoints: 0,
	memberLikes: 0,
	memberFollowings: 0,
	memberFollowers: 0,
	memberViews: 0,
	eventOrganizedCount: 0,
	memberRank: 0,
	memberGroups: 0,
	memberEvents: 0,
	createdAt: new Date(),
	updatedAt: new Date(),
});
