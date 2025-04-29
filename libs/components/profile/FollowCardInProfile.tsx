import { Member } from '@/libs/types/member/member';
import { User } from 'lucide-react';

interface FollowCardInProfileProps {
	member: Member;
}

export const FollowCardInProfile = ({ member }: FollowCardInProfileProps) => {
	return (
		<div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4">
			<div className="flex items-center space-x-4">
				<div className="relative">
					<img
						src={member.memberImage || '/default-avatar.png'}
						alt={member.memberFullName}
						className="w-12 h-12 rounded-full object-cover"
					/>
					{member.memberType === 'ORGANIZER' && (
						<div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
							<User className="h-3 w-3" />
						</div>
					)}
				</div>
				<div className="flex-1">
					<h3 className="font-medium text-gray-900">{member.memberFullName}</h3>
					<p className="text-sm text-gray-500">@{member.username}</p>
				</div>
				<div className="text-sm text-gray-500">{member.memberPoints} points</div>
			</div>
		</div>
	);
};
