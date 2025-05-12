import { MemberStatus, MemberType } from '@/libs/enums/member.enum';

export interface MemberUpdateInput {
	_id?: string;
	username?: string;
	memberEmail?: string;
	memberPassword?: string;
	memberPhone?: string;
	memberFullName?: string;
	memberDesc?: string;
	memberImage?: string;
	memberStatus?: MemberStatus;
	emailVerified?: boolean;
	memberType?: MemberType;
	memberPoints?: number;
}

export interface PasswordUpdateInput {
	currentPassword: string;
	newPassword: string;
}
