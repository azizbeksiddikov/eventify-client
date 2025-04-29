import { Member } from '@/libs/types/member/member';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface ProfileFollowersProps {
	followers: Member[];
}

export const ProfileFollowers = ({ followers }: ProfileFollowersProps) => {
	return (
		<div className="bg-white shadow rounded-lg p-6">
			<h2 className="text-lg font-medium text-gray-900 mb-4">My Followers</h2>
			<div className="space-y-4">
				{followers.length === 0 ? (
					<p className="text-gray-500">No followers found</p>
				) : (
					followers.map((user) => (
						<div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
							<div className="flex items-center gap-4">
								<Avatar className="h-10 w-10">
									{user.memberImage ? (
										<AvatarImage src={user.memberImage} alt={user.memberFullName} />
									) : (
										<AvatarFallback className="bg-white border border-gray-200 flex items-center justify-center">
											<User className="text-gray-800" style={{ width: 24, height: 24, strokeWidth: 2 }} />
										</AvatarFallback>
									)}
								</Avatar>
								<div>
									<h3 className="font-medium text-gray-900">{user.memberFullName}</h3>
									<p className="text-sm text-gray-500">@{user.username}</p>
								</div>
							</div>
							<button className="text-gray-900 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50">
								View Profile
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
};
