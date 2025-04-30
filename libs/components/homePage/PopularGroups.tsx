import React from 'react';
import { ArrowRight } from 'lucide-react';
import GroupCard from '@/libs/components/group/GroupCard';
import { groupList } from '@/data';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const PopularGroups = () => {
	const router = useRouter();
	const groups = groupList.slice(0, 4);

	return (
		<section className="py-20 bg-muted">
			<div className="w-[90%] mx-auto ">
				<div className="flex items-center justify-between mb-8">
					<h2>Popular Groups</h2>

					<Button type="submit" onClick={() => router.push('/groups')} className="h-14 px-8 ">
						<div className="flex items-center gap-1 ">
							View All Groups
							<ArrowRight className="w-4 h-4" />
						</div>
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{groups.map((group) => (
						<GroupCard key={group._id} group={group} />
					))}
				</div>
			</div>
		</section>
	);
};

export default PopularGroups;
