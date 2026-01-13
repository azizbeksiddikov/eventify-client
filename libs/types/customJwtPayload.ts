import { JwtPayload } from "jwt-decode";
import { MemberType, MemberStatus } from "@/libs/enums/member.enum";

export interface CustomJwtPayload extends JwtPayload {
	_id: string;
	username: string;
	memberEmail: string;
	memberPhone?: string;
	memberFullName: string;
	memberType: MemberType | string;
	memberStatus: MemberStatus | string;
	emailVerified: boolean;
	memberDesc?: string;
	memberImage?: string;
	memberPoints: number;
	memberLikes: number;
	memberFollowings: number;
	memberFollowers: number;
	memberViews: number;
	memberGroups: number;
	memberEvents: number;
	memberRank: number;
	eventOrganizedCount: number;
	eventsOrganizedCount: number;
	createdAt: Date;
	updatedAt: Date;
}
