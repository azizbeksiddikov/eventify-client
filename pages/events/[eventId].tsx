import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import Comments from '@/libs/components/common/CommentsComponent';
import { CommentGroup } from '@/libs/enums/comment.enum';
import { eventList, groupList, organizers, comments } from '@/data';
import { Event } from '@/libs/types/event/event';
import { Member } from '@/libs/types/member/member';
import { Group } from '@/libs/types/group/group';

import ChosenEventData from '@/libs/components/events/ChosenEventData';
import ChosenEventHeader from '@/libs/components/events/ChosenEventHeader';
import ChosenEventOther from '@/libs/components/events/ChosenEventOther';

const ChosenEvent = () => {
	const event: Event = eventList[0];
	const organizer: Member = organizers[0];
	const group: Group = groupList[0];
	const similarEvents: Event[] = eventList.slice(1, 4);

	return (
		<div>
			<ChosenEventHeader />

			<div className="w-[90%] mx-auto pb-10">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					<div className="lg:col-span-3">
						<ChosenEventData event={event} />
					</div>
					<ChosenEventOther similarEvents={similarEvents} group={group} organizer={organizer} />
				</div>
				{/* Comments Section */}
				<Comments comments={comments} commentGroup={CommentGroup.EVENT} commentRefId={event._id} />
			</div>
		</div>
	);
};

export default withBasicLayout(ChosenEvent);
