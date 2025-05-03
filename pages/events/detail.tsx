import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import { userVar } from '@/apollo/store';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';

import { GET_EVENT } from '@/apollo/user/query';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import CommentsComponent from '@/libs/components/common/CommentsComponent';
import { CommentGroup } from '@/libs/enums/comment.enum';
import { Event } from '@/libs/types/event/event';
import ChosenEventData from '@/libs/components/events/ChosenEventData';
import ChosenEventHeader from '@/libs/components/events/ChosenEventHeader';
import ChosenEventOther from '@/libs/components/events/ChosenEventOther';
import { Message } from '@/libs/enums/common.enum';
import { LIKE_TARGET_EVENT } from '@/apollo/user/mutation';
import { smallError, smallSuccess } from '@/libs/alert';
import { likeHandler } from '@/libs/utils';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ChosenEvent = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const [eventId, setEventId] = useState<string | null>(null);
	const user = useReactiveVar(userVar);
	const [event, setEvent] = useState<Event | null>(null);

	/** APOLLO REQUESTS **/
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);

	const { data: getEventData } = useQuery(GET_EVENT, {
		fetchPolicy: 'network-only',
		variables: { input: eventId },
		skip: !eventId,
		notifyOnNetworkStatusChange: true,
	});

	/** LIFECYCLES */
	useEffect(() => {
		if (router.query.id) {
			setEventId(router.query.id as string);
		}
	}, [router]);

	useEffect(() => {
		if (getEventData?.getEvent) setEvent(getEventData.getEvent);
	}, [getEventData]);

	/**  HANDLERS */

	const likeEventHandler = async (eventId: string) => {
		await likeHandler(user._id, eventId, likeTargetEvent, t('Event liked successfully'));
	};

	const purchaseTicketHandler = async () => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await smallSuccess(t('Ticket purchased successfully'));
		} catch (error: unknown) {
			if (error instanceof Error) {
				await smallError(error.message);
			}
		}
	};

	return (
		<div>
			<ChosenEventHeader />

			<div className="w-[90%] mx-auto pb-10">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					<div className="lg:col-span-3">
						<ChosenEventData
							event={event}
							purchaseTicketHandler={purchaseTicketHandler}
							likeEventHandler={likeEventHandler}
						/>
					</div>
					<ChosenEventOther event={event} likeEventHandler={likeEventHandler} />
				</div>
				{/* Comments Section */}
				{eventId && <CommentsComponent commentRefId={eventId} commentGroup={CommentGroup.EVENT} />}
			</div>
		</div>
	);
};

export default withBasicLayout(ChosenEvent);
