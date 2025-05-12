import { GroupMemberRole } from '@/libs/enums/group.enum';
import { Member } from '@/libs/types/member/member';

export interface GroupMember {
	_id: string;
	groupId: string;
	memberId: string;
	groupMemberRole: GroupMemberRole;
	joinDate: Date;
	createdAt: Date;
	updatedAt: Date;

	memberData?: Member;
}
