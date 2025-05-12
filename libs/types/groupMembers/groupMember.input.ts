import { GroupMemberRole } from '@/libs/enums/group.enum';

export interface GroupMemberInput {
	groupId: string;
	memberId: string;
	groupMemberRole: GroupMemberRole;
	joinDate: Date;
}
