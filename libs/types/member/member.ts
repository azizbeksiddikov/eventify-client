import { MemberType, MemberStatus } from '../../enums/member.enum';
import { MeFollowed } from '../follow/follow';
import { Group } from '../group/group';
import { MeLiked } from '../like/like';

export interface Member {
	_id: string;
	username: string;
	memberEmail: string;
	memberPhone?: string;
	memberFullName: string;
	memberType: MemberType;
	memberStatus: MemberStatus;
	emailVerified: boolean;
	memberDesc?: string;
	memberImage?: string;
	memberPoints: number;
	memberLikes: number;
	memberFollowings: number;
	memberFollowers: number;
	memberViews: number;
	createdAt: Date;
	updatedAt: Date;
	eventOrganizedCount: number;
	// memberPassword: string;
	accessToken?: string;

	meLiked?: MeLiked[];
	meFollowed?: MeFollowed[];
	events?: Event[];
	groups?: Group[];
	organizedEvents?: Event[];
	organizedGroups?: Group[];
}

export interface TotalCounter {
	total?: number;
}

export interface Members {
	list: Member[];
	metaCounter: TotalCounter[];
}
