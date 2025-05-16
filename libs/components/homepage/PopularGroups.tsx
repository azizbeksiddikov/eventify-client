import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useQuery } from '@apollo/client';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/libs/components/ui/button';
import GroupCard from '@/libs/components/common/GroupCard';

import { GET_GROUPS } from '@/apollo/user/query';
import { GroupsInquiry } from '@/libs/types/group/group.input';
import { Group } from '@/libs/types/group/group';
import { Direction } from '@/libs/enums/common.enum';

interface PopularGroupsProps {
	initialInput?: GroupsInquiry;
}

const PopularGroups = ({
	initialInput = {
		page: 1,
		limit: 4,
		sort: 'groupViews',
		direction: Direction.DESC,
		search: {},
	},
}: PopularGroupsProps) => {
	const router = useRouter();
	const { t } = useTranslation('common');

	/** APOLLO */

	const { data: popularGroups } = useQuery(GET_GROUPS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
	});

	const groups: Group[] = popularGroups?.getGroups?.list;

	return (
		<section className="py-10 sm:py-20 bg-muted">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 sm:gap-0">
					<h2 className="text-xl sm:text-2xl my-4">{t('Popular Groups')}</h2>

					<Button type="submit" onClick={() => router.push('/event')} className="h-10 sm:h-14 px-4 sm:px-8">
						<div className="flex items-center gap-1">
							{t('View All Groups')}
							<ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
						</div>
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{groups && groups.map((group) => <GroupCard key={group._id} group={group} />)}
				</div>
			</div>
		</section>
	);
};

export default PopularGroups;
