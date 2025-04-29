import { Trash2 } from 'lucide-react';
import { Member } from '@/libs/types/member/member';
import { Button } from '@/components/ui/button';

interface AdminUserCardProps {
	member: Member;
	onDelete: (memberId: string) => void;
}

const AdminUserCard = ({ member, onDelete }: AdminUserCardProps) => {
	const handleDelete = () => {
		// Show confirmation dialog
		if (window.confirm('Are you sure you want to delete this user?')) {
			onDelete(member._id);
		}
	};

	console.log(member);

	return (
		<div className="bg-white rounded-lg shadow-md p-4">
			<div className="flex justify-between items-start">
				<div className="flex items-center gap-3">
					{member.memberImage ? (
						<img src={member.memberImage} alt={member.memberFullName} className="w-12 h-12 rounded-full object-cover" />
					) : (
						<div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
							<span className="text-gray-400 text-lg">{member.memberFullName.charAt(0)}</span>
						</div>
					)}
					<div>
						<h3 className="font-semibold">{member.memberFullName}</h3>
						<p className="text-sm text-gray-500">@{member.username}</p>
					</div>
				</div>
				<Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-600 hover:text-red-700">
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>
			<div className="mt-4 grid grid-cols-2 gap-2 text-sm">
				<div>
					<span className="text-gray-500">Status:</span>
					<span className="ml-2">{member.memberStatus}</span>
				</div>
				<div>
					<span className="text-gray-500">Type:</span>
					<span className="ml-2">{member.memberType}</span>
				</div>
				<div>
					<span className="text-gray-500">Likes:</span>
					<span className="ml-2">{member.memberLikes}</span>
				</div>
				<div>
					<span className="text-gray-500">Followings:</span>
					<span className="ml-2">{member.memberFollowings}</span>
				</div>
				<div>
					<span className="text-gray-500">Followers:</span>
					<span className="ml-2">{member.memberFollowers}</span>
				</div>
				<div>
					<span className="text-gray-500">Points:</span>
					<span className="ml-2">{member.memberPoints}</span>
				</div>
			</div>
		</div>
	);
};

export default AdminUserCard;
