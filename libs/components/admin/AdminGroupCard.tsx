import { Trash2 } from 'lucide-react';
import { Group } from '@/libs/types/group/group';
import { Button } from '@/components/ui/button';
import { GroupCategory } from '@/libs/enums/group.enum';

interface AdminGroupCardProps {
	group: Group;
	onDelete: (groupId: string) => void;
}

const AdminGroupCard = ({ group, onDelete }: AdminGroupCardProps) => {
	const handleDelete = () => {
		if (window.confirm('Are you sure you want to delete this group?')) {
			onDelete(group._id);
		}
	};

	const getCategoryColor = (category: GroupCategory) => {
		switch (category) {
			case GroupCategory.TECHNOLOGY:
				return 'bg-blue-100 text-blue-800';
			case GroupCategory.FOOD:
				return 'bg-green-100 text-green-800';
			case GroupCategory.ENTERTAINMENT:
				return 'bg-purple-100 text-purple-800';
			case GroupCategory.SPORTS:
				return 'bg-orange-100 text-orange-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-4">
			<div className="flex justify-between items-start">
				<div className="flex items-center gap-3">
					{group.groupImage ? (
						<img src={group.groupImage} alt={group.groupName} className="w-12 h-12 rounded-lg object-cover" />
					) : (
						<div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
							<span className="text-gray-400 text-lg">{group.groupName.charAt(0)}</span>
						</div>
					)}
					<div>
						<h3 className="font-semibold">{group.groupName}</h3>
						<p className="text-sm text-gray-500">{new Date(group.createdAt).toLocaleDateString()}</p>
					</div>
				</div>
				<Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-600 hover:text-red-700">
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>
			<div className="mt-4 grid grid-cols-2 gap-2 text-sm">
				<div>
					<span className="text-gray-500">Categories:</span>
					<div className="flex flex-wrap gap-1 mt-1">
						{group.groupCategories.map((category) => (
							<span key={category} className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(category)}`}>
								{category}
							</span>
						))}
					</div>
				</div>
				<div>
					<span className="text-gray-500">Members:</span>
					<span className="ml-2">{group.memberCount}</span>
				</div>
				<div>
					<span className="text-gray-500">Likes:</span>
					<span className="ml-2">{group.groupLikes}</span>
				</div>
				<div>
					<span className="text-gray-500">Views:</span>
					<span className="ml-2">{group.groupViews}</span>
				</div>
				<div>
					<span className="text-gray-500">Events:</span>
					<span className="ml-2">{group.eventsCount}</span>
				</div>
			</div>
		</div>
	);
};

export default AdminGroupCard;
