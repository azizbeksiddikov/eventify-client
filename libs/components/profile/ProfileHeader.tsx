import { Member } from '@/libs/types/member/member';
import { User } from 'lucide-react';
import { MemberTypeBadge } from './MemberTypeBadge';

interface ProfileHeaderProps {
	member: Member;
}

export const ProfileHeader = ({ member }: ProfileHeaderProps) => {
	return (
		<div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
			<div className="flex items-center space-x-8">
				<div className="relative">
					{member.memberImage ? (
						<img
							src={member.memberImage}
							alt={member.memberFullName}
							className="w-32 h-32 rounded-full object-cover ring-2 ring-gray-100"
						/>
					) : (
						<div className="w-32 h-32 rounded-full bg-gray-50 flex items-center justify-center ring-2 ring-gray-100">
							<User className="h-16 w-16 text-gray-300" />
						</div>
					)}
					<div className="absolute -bottom-2 -right-2">
						<MemberTypeBadge memberType={member.memberType} size="lg" />
					</div>
				</div>
				<div className="space-y-2">
					<h1 className="text-3xl font-semibold text-gray-900 tracking-tight">{member.memberFullName}</h1>
					<p className="text-gray-500 text-lg">@{member.username}</p>
					{member.memberDesc && <p className="text-gray-600 text-lg mt-4 max-w-2xl">{member.memberDesc}</p>}
				</div>
			</div>
		</div>
	);
};
