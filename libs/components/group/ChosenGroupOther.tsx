import Owner from "@/libs/components/common/Owner";
import SimilarGroups from "@/libs/components/common/SimilarGroups";

import { Group } from "@/libs/types/group/group";

interface ChosenGroupOtherProps {
	group: Group | null;
}

const ChosenGroupOther = ({ group }: ChosenGroupOtherProps) => {
	if (!group) return null;
	return (
		<div className="space-y-8">
			{/* Owner's Info */}
			{group.memberData && <Owner member={group.memberData} />}

			{/* {group.groupModerators && <GroupModerators groupModerators={group.groupModerators} />} */}

			{/* Similar Groups */}
			{group.similarGroups && group.similarGroups.length > 0 ? (
				<SimilarGroups groups={group.similarGroups} />
			) : (
				<div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
					<h3 className="font-semibold leading-none tracking-tight mb-2">Similar Groups</h3>
					<p className="text-sm text-muted-foreground">No similar groups found.</p>
				</div>
			)}
		</div>
	);
};

export default ChosenGroupOther;
