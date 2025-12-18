import { MemberType, MemberStatus } from "@/libs/enums/member.enum";
import { MeFollowed } from "@/libs/types/follow/follow";
import { Group } from "@/libs/types/group/group";
import { MeLiked } from "@/libs/types/like/like";
import { Event } from "@/libs/types/event/event";

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
	eventsOrganizedCount: number;
	memberRank: number;
	memberGroups: number;
	memberEvents: number;

	createdAt: Date;
	updatedAt: Date;
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
