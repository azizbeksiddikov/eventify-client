import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';

import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import OrganizerCard from '@/libs/components/common/OrganizerCard';
import OrganizersHeader from '@/libs/components/organizer/OrganizersHeader';
import SortAndFilterOrganizers from '@/libs/components/organizer/SortAndFilterOrganizers';
import PaginationComponent from '@/libs/components/common/PaginationComponent';

import { GET_ORGANIZERS } from '@/apollo/user/query';
import { SUBSCRIBE, UNSUBSCRIBE, LIKE_TARGET_MEMBER } from '@/apollo/user/mutation';
import { Direction, Message } from '@/libs/enums/common.enum';
import { OrganizersInquiry } from '@/libs/types/member/member.input';
import { smallError, smallSuccess } from '@/libs/alert';
import { Member } from '@/libs/types/member/member';
import { userVar } from '@/apollo/store';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

interface OrganizersPageProps {
	initialSearch?: OrganizersInquiry;
}

const OrganizersPage = ({
	initialSearch = {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {
			text: '',
		},
	},
}: OrganizersPageProps) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');

	const readUrl = (): OrganizersInquiry => {
		if (router?.query) {
			return {
				page: Math.max(1, Number(router.query.page) || initialSearch.page),
				limit: Math.max(1, Number(router.query.limit) || initialSearch.limit),
				sort: (router.query.sort as string) || initialSearch.sort,
				direction: router.query.direction === '1' ? Direction.ASC : Direction.DESC,
				search: {
					text: (router.query.text as string) || initialSearch.search.text,
				},
			};
		}
		return initialSearch;
	};

	const [organizerSearch, setOrganizerSearch] = useState<OrganizersInquiry>(() => readUrl());

	const updateURL = (newSearch: OrganizersInquiry) => {
		const query: Record<string, string> = {
			page: Math.max(initialSearch.page, newSearch.page).toString(),
			limit: Math.max(1, newSearch.limit).toString(),
			sort: newSearch.sort || initialSearch.sort || 'createdAt',
			direction: newSearch.direction === Direction.ASC ? '1' : '-1',
		};

		if (newSearch.search?.text) {
			query.text = newSearch.search.text;
		}

		router.push({ query }, undefined, { shallow: true });
	};
	/** APOLLO */
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);

	const { data: organizersData } = useQuery(GET_ORGANIZERS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: organizerSearch,
		},
		notifyOnNetworkStatusChange: true,
	});

	const organizers: Member[] = organizersData?.getOrganizers?.list || [];

	/** LIFECYCLE */
	useEffect(() => {
		setOrganizerSearch(readUrl());
	}, [router]);

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

	const pageChangeHandler = (newPage: number) => {
		updateURL({ ...organizerSearch, page: newPage });
	};

	return (
		<div className="bg-background">
			<OrganizersHeader />
			<SortAndFilterOrganizers updateURL={updateURL} organizerSearch={organizerSearch} initialSearch={initialSearch} />

			<div className="max-w-7xl py-10 mx-auto mb-10">
				{/* Organizers Grid */}
				<div>
					{organizers.length > 0 ? (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{organizers.map((organizer) => (
									<OrganizerCard
										key={organizer._id}
										organizer={organizer}
										likeHandler={likeMemberHandler}
										subscribeHandler={subscribeHandler}
										unsubscribeHandler={unsubscribeHandler}
									/>
								))}
							</div>

							{/* Pagination */}
							<div className="mt-8 flex justify-center">
								<PaginationComponent
									totalItems={organizers.length}
									currentPage={organizerSearch.page}
									pageChangeHandler={pageChangeHandler}
								/>
							</div>
						</>
					) : (
						<div className="text-center py-12">
							<p className="text-muted-foreground">{t('No organizers found. Try adjusting your filters')}.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default withBasicLayout(OrganizersPage);
