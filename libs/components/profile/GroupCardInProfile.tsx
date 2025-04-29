import { Group } from '@/libs/types/group/group';
import { Users, Calendar } from 'lucide-react';

interface GroupCardInProfileProps {
	group: Group;
}

export const GroupCardInProfile = ({ group }: GroupCardInProfileProps) => {
	return (
		<div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4">
			<div className="flex items-start space-x-4">
				<img
					src={group.groupImage || '/default-group.jpg'}
					alt={group.groupName}
					className="w-16 h-16 rounded-lg object-cover"
				/>
				<div className="flex-1">
					<h3 className="font-medium text-gray-900">{group.groupName}</h3>
					<p className="text-sm text-gray-500 mt-1">{group.groupDesc}</p>
					<div className="flex items-center space-x-4 mt-2">
						<div className="flex items-center text-sm text-gray-500">
							<Users className="h-4 w-4 mr-1" />
							{group.memberCount} members
						</div>
						<div className="flex items-center text-sm text-gray-500">
							<Calendar className="h-4 w-4 mr-1" />
							{group.eventsCount} events
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
