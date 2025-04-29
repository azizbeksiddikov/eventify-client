import { Group } from '@/libs/types/group/group';
import { Users } from 'lucide-react';

interface ProfileGroupsProps {
	groups: Group[];
	isOrganizer: boolean;
}

export const ProfileGroups = ({ groups, isOrganizer }: ProfileGroupsProps) => {
	return (
		<div className="bg-white rounded-lg shadow">
			<div className="px-6 py-4 border-b border-gray-200">
				<h2 className="text-lg font-medium text-gray-900">{isOrganizer ? 'Groups Organized' : 'Groups Joined'}</h2>
			</div>
			<div className="divide-y divide-gray-200">
				{groups.length === 0 ? (
					<div className="px-6 py-4 text-center text-gray-500">No groups found</div>
				) : (
					groups.map((group) => (
						<div key={group._id} className="px-6 py-4">
							<div className="flex items-center">
								<div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
									<Users className="h-6 w-6 text-gray-600" />
								</div>
								<div className="ml-4 flex-1">
									<h3 className="text-sm font-medium text-gray-900">{group.groupName}</h3>
									<p className="text-sm text-gray-500">{group.groupDesc}</p>
									<p className="text-sm text-gray-500 mt-1">{group.memberCount} members</p>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};
