import { User } from 'lucide-react';

import { Member } from '@/libs/types/member/member';
import { REACT_APP_API_URL } from '@/libs/config';

interface ProfileHeaderProps {
	member: Member;
}

export const ProfileHeader = ({ member }: ProfileHeaderProps) => {
	return (
		<div className="bg-card rounded-xl shadow-sm p-6 md:p-8 mb-8">
			<div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
				<div className="relative">
					{member.memberImage ? (
						<img
							src={`${REACT_APP_API_URL}/${member.memberImage}`}
							alt={member.memberFullName}
							className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover ring-2 ring-ring/20"
						/>
					) : (
						<div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted flex items-center justify-center ring-2 ring-ring/20">
							<User className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground/50" />
						</div>
					)}
				</div>
				<div className="flex flex-col items-center md:items-start space-y-3">
					<h1 className="text-2xl md:text-3xl font-semibold text-card-foreground">{member.memberFullName}</h1>
					<p className="text-muted-foreground text-base md:text-lg">@{member.username}</p>
					{member.memberDesc && (
						<p className="text-card-foreground/80 text-base md:text-lg mt-2 max-w-2xl text-center md:text-left">
							{member.memberDesc}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
