import { JwtPayload } from 'jwt-decode';

export interface CustomJwtPayload extends JwtPayload {
	_id: string;
	username: string;
	memberEmail: string;
	memberPhone?: string;
	memberFullName: string;
	memberType: string;
	memberStatus: string;
	emailVerified: boolean;
	memberDesc?: string;
	memberImage?: string;
	memberPoints: number;
	memberLikes: number;
	memberFollowings: number;
	memberFollowers: number;
	memberViews: number;

	eventOrganizedCount: number;
	createdAt: Date;
	updatedAt: Date;
}
