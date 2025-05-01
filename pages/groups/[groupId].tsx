import { Group } from '@/libs/types/group/group';

import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { Comment } from '@/libs/types/comment/comment';
import Comments from '@/libs/components/common/CommentsComponent';
import { CommentGroup } from '@/libs/enums/comment.enum';
import { Event } from '@/libs/types/event/event';

import ChosenGroupHeader from '@/libs/components/group/ChosenGroupHeader';

import { groupList, groupAdmins, organizers, comments, eventList } from '@/data';
import { Member } from '@/libs/types/member/member';
import ChosenGroupData from '@/libs/components/group/ChosenGroupData';
import GroupModerators from '@/libs/components/group/GroupModerators';
import GroupOwner from '@/libs/components/group/GroupOwner';
import SimilarGroups from '@/libs/components/group/SimilarGroups';
import UpcomingEvents from '@/libs/components/common/UpcomingEvents';

const GroupDetailPage = () => {
	// Mock data
	const group: Group = groupList[0];
	const similarGroups: Group[] = groupList.slice(1, 4);
	const memberProfiles: Member[] = organizers;
	const groupComments: Comment[] = comments;
	const groupEvents: Event[] = eventList;

	return (
		<div>
			<ChosenGroupHeader />

			<div className="w-[80%] mx-auto pb-10">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<ChosenGroupData group={group} />
					<div className="space-y-6">
						{/* Group Owner Section */}
						<GroupOwner groupOwner={memberProfiles[0]} />

						{/* Moderators Section */}
						<GroupModerators groupAdmins={groupAdmins} />

						<SimilarGroups similarGroups={similarGroups} />
					</div>
				</div>

				{/* Events Section */}
				<UpcomingEvents events={groupEvents} />

				{/* Comments Section */}
				<Comments comments={groupComments} commentRefId={group._id} commentGroup={CommentGroup.GROUP} />
			</div>
		</div>
	);
};

export default withBasicLayout(GroupDetailPage);
