import { GroupMemberRole } from '../../enums/group.enum';

export interface GroupMember {
	_id: string;
	groupId: string;
	memberId: string;
	groupMemberRole: GroupMemberRole;
	joinDate: Date;
	createdAt: Date;
	updatedAt: Date;
}
