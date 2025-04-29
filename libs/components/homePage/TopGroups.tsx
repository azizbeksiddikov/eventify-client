import { GroupCategory } from '@/libs/enums/group.enum';
import { GroupInput } from '@/libs/types/group/group.input';
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { GroupCard } from './GroupCard';

const TopGroups = () => {
	const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());

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

	const groups: GroupInput[] = [
		{
			_id: '1',
			name: 'Tech Innovators',
			description: 'A community of technology enthusiasts and professionals.',
			image: '/images/groups/tech-innovators.jpg',
			category: GroupCategory.TECHNOLOGY as GroupCategory,
			organizerId: '1',
			membersCount: 1500,
			eventsCount: 25,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			_id: '2',
			name: 'Food Lovers',
			description: 'Join us to explore the world of culinary arts and gastronomy.',
			image: '/images/groups/food-lovers.jpg',
			category: GroupCategory.FOOD as GroupCategory,
			organizerId: '2',
			membersCount: 800,
			eventsCount: 15,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	return (
		<section className=" animate-fadeIn">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-[#111111]">Popular Groups</h2>
				<Link
					href="/groups"
					className="text-[#E60023] hover:text-[#CC0000] transition-colors duration-200 flex items-center gap-1"
				>
					View All Groups
					<ArrowRight className="w-4 h-4" />
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{groups.map((group) => (
					<GroupCard key={group._id} group={group} onJoin={handleJoinGroup} isJoined={joinedGroups.has(group._id)} />
				))}
			</div>
		</section>
	);
};

export default TopGroups;
