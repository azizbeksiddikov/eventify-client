import { GroupMemberRole } from '../../enums/group.enum';
import { Member } from '../member/member';

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
