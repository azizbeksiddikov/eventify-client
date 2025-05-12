import { GroupMemberRole } from '@/libs/enums/group.enum';

export interface GroupMemberUpdateInput {
	groupId: string;
	targetMemberId: string;
	groupMemberRole: GroupMemberRole;
}
