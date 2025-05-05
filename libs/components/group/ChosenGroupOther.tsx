import Owner from '@/libs/components/common/Owner';
import GroupModerators from '@/libs/components/group/GroupModerators';
import SimilarGroups from '@/libs/components/common/SimilarGroups';

import { Group } from '@/libs/types/group/group';

interface ChosenGroupOtherProps {
	group: Group | null;
}

const ChosenGroupOther = ({ group }: ChosenGroupOtherProps) => {
	if (!group) return null;

	return (
		<div className="space-y-8">
			{/* Owner's Info */}
			{group.memberData && <Owner member={group.memberData} />}

			{group.groupModerators && <GroupModerators groupModerators={group.groupModerators} />}

			{group.similarGroups && <SimilarGroups groups={group.similarGroups} />}
		</div>
	);
};

export default ChosenGroupOther;
