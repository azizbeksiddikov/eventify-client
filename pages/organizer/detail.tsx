import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_ORGANIZER } from '@/apollo/user/query';
import { LIKE_TARGET_EVENT, LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from '@/apollo/user/mutation';
import { userVar } from '@/apollo/store';

import { Member } from '@/libs/types/member/member';
import { CommentGroup } from '@/libs/enums/comment.enum';
import { Message } from '@/libs/enums/common.enum';

import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import CommentsComponent from '@/libs/components/common/CommentsComponent';
import UpcomingEvents from '@/libs/components/common/UpcomingEvents';
import OrganizerHeader from '@/libs/components/organizer/OrganizerHeader';
import OrganizerProfile from '@/libs/components/organizer/OrganizerProfile';
import SimilarGroups from '@/libs/components/common/SimilarGroups';

import { smallError, smallSuccess } from '@/libs/alert';
import { likeHandler } from '@/libs/utils';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const OrganizerDetailPage = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');

	const [organizerId, setOrganizerId] = useState<string | null>(null);
	const [organizer, setOrganizer] = useState<Member | null>(null);

	/** APOLLO */
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);

	const { data: getOrganizerData } = useQuery(GET_ORGANIZER, {
		fetchPolicy: 'cache-and-network',
		skip: !organizerId,
		variables: { input: organizerId },
		notifyOnNetworkStatusChange: true,
	});

	/** LIFECYCLE */
	useEffect(() => {
		if (router.query.organizerId) {
			setOrganizerId(router.query.organizerId as string);
		}
	}, [router]);

	useEffect(() => {
		if (getOrganizerData?.getOrganizer) {
			setOrganizer(getOrganizerData.getOrganizer);
		}
	}, [getOrganizerData]);

	/** HANDLERS */
	const likeMemberHandler = async (memberId: string) => {
		try {
			if (!memberId) return;
			if (!user._id || user._id === '') throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetMember({
				variables: { input: memberId },
			});

			await smallSuccess(t('Member liked successfully'));
		} catch (err: any) {
			console.log('ERROR, likeMemberHandler:', err.message);
			smallError(err.message);
		}
	};

	const subscribeHandler = async (memberId: string) => {
		try {
			if (!memberId) return;
			if (!user._id || user._id === '') throw new Error(Message.NOT_AUTHENTICATED);

			await subscribe({
				variables: { input: memberId },
			});

			await smallSuccess(t('Member subscribed successfully'));
		} catch (err: any) {
			console.log('ERROR, subscribeHandler:', err.message);
			smallError(err.message);
		}
	};

	const unsubscribeHandler = async (memberId: string) => {
		try {
			if (!memberId) return;
			if (!user._id || user._id === '') throw new Error(Message.NOT_AUTHENTICATED);

			await unsubscribe({
				variables: { input: memberId },
			});

			await smallSuccess(t('Member unsubscribed successfully'));
		} catch (err: any) {
			console.log('ERROR, unsubscribeHandler:', err.message);
			smallError(err.message);
		}
	};

	const likeEventHandler = async (eventId: string) => {
		await likeHandler(user._id, eventId, likeTargetEvent, t('Event liked successfully'));
	};

	if (!organizer) return null;
	return (
		<div>
			<OrganizerHeader />

			<div className="w-[80%] mx-auto pb-10">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<OrganizerProfile
						organizer={organizer}
						likeMemberHandler={likeMemberHandler}
						subscribeHandler={subscribeHandler}
						unsubscribeHandler={unsubscribeHandler}
					/>
					<div className="space-y-6">
						{organizer?.organizedGroups && organizer.organizedGroups.length > 0 && (
							<SimilarGroups groups={organizer.organizedGroups} text={t('Organizer Groups')} />
						)}
					</div>
				</div>

				{/* Events Section */}
				{organizer?.organizedEvents && organizer.organizedEvents.length > 0 && (
					<UpcomingEvents
						events={organizer.organizedEvents}
						organizerName={organizer.memberFullName}
						likeEventHandler={likeEventHandler}
					/>
				)}

				{/* Comments Section */}
				<CommentsComponent commentRefId={organizer._id} commentGroup={CommentGroup.MEMBER} />
			</div>
		</div>
	);
};

export default withBasicLayout(OrganizerDetailPage);
