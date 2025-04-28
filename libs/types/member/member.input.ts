import { MemberStatus, MemberType } from '../../enums/member.enum';
import { Direction } from '../../enums/common.enum';

export interface MemberInput {
	username: string;
	memberEmail: string;
	memberPassword: string;
	memberFullName: string;
	memberPhone?: string;
	memberType?: MemberType;
}

export interface LoginInput {
	username: string;
	memberPassword: string;
}

export interface OISearch {
	text?: string;
}

export interface MISearch {
	memberStatus?: MemberStatus;
	memberType?: MemberType;
	text?: string;
}

export interface OrganizersInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: OISearch;
}

export interface MembersInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: MISearch;
}

export enum MemberType {
	USER = 'USER',
	ORGANIZER = 'ORGANIZER',
	ADMIN = 'ADMIN',
}

export interface OrganizerInput {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	memberType: MemberType.ORGANIZER;
	profileImage?: string;
	bio?: string;
	website?: string;
	socialMedia?: {
		facebook?: string;
		twitter?: string;
		instagram?: string;
		linkedin?: string;
	};
	createdAt: Date;
	updatedAt: Date;
}
