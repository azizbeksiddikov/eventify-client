import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { GroupCard } from './GroupCard';
import { groupList } from '@/data';

const TopGroups = () => {
	const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());
	const groups = groupList.slice(0, 4);
	const handleJoinGroup = (groupId: string) => {
		// Only allow joining, not unjoining
		if (!joinedGroups.has(groupId)) {
			setJoinedGroups((prev) => {
				const newSet = new Set(prev);
				newSet.add(groupId);
				return newSet;
			});
		}
	};

	return (
		<section className="my-10 bg-secondary/5 py-20">
			<div className="w-[90%] mx-auto">
				<div className="flex items-center justify-between mb-8">
					<h2 className="text-3xl font-bold text-foreground">Popular Groups</h2>
					<Link
						href="/groups"
						className="text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-1"
					>
						View All Groups
						<ArrowRight className="w-4 h-4" />
					</Link>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{groups.map((group) => (
						<GroupCard key={group._id} group={group} onJoin={handleJoinGroup} isJoined={joinedGroups.has(group._id)} />
					))}
				</div>
			</div>
		</section>
	);
};

export default TopGroups;
