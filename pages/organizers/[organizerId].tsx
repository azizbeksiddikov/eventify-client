import { useState } from 'react';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { Member } from '@/libs/types/member/member';
import { Event } from '@/libs/types/event/event';
import { Group } from '@/libs/types/group/group';
import { CommentGroup } from '@/libs/enums/comment.enum';
import CommentsComponent from '@/libs/components/common/CommentsComponent';
import { comments, eventList, groupList, organizers } from '@/data';
import UpcomingEvents from '@/libs/components/common/UpcomingEvents';
import OrganizerHeader from '@/libs/components/organizer/OrganizerHeader';
import OrganizerProfile from '@/libs/components/organizer/OrganizerProfile';
import SimilarGroups from '@/libs/components/common/SimilarGroups';

const OrganizerDetailPage = () => {
	const [isLiked, setIsLiked] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);

	const handleLike = async () => {
		try {
			setIsLiked(!isLiked);
			// TODO: Implement like/unlike API call
		} catch (error) {
			console.error('Error updating like:', error);
			setIsLiked(!isLiked);
		}
	};

	const handleFollow = async () => {
		try {
			setIsFollowing(!isFollowing);
			// TODO: Implement follow/unfollow API call
		} catch (error) {
			console.error('Error updating follow status:', error);
			setIsFollowing(!isFollowing);
		}
	};

	const organizer: Member = organizers[0];
	const organizerEvents: Event[] = eventList;
	const organizerGroups: Group[] = groupList;

	return (
		<div>
			<OrganizerHeader />

			<div className="w-[80%] mx-auto pb-10">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<OrganizerProfile
						organizer={organizer}
						isLiked={isLiked}
						isFollowing={isFollowing}
						onLike={handleLike}
						onFollow={handleFollow}
					/>
					<div className="space-y-6">
						<SimilarGroups groups={organizerGroups} text="Organizer Groups" />
					</div>
				</div>

				{/* Events Section */}
				<UpcomingEvents events={organizerEvents} memberName={organizer.memberFullName} />

				{/* Comments Section */}
				<CommentsComponent comments={comments} commentGroup={CommentGroup.MEMBER} commentRefId={organizer._id} />
			</div>
		</div>
	);
};

export default withBasicLayout(OrganizerDetailPage);
