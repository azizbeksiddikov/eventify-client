import { User } from 'lucide-react';

import { Member } from '@/libs/types/member/member';
import { REACT_APP_API_URL } from '@/libs/config';
import { MemberType } from '@/libs/enums/member.enum';
import { useTranslation } from 'react-i18next';

interface ProfileHeaderProps {
	member: Member;
}

export const ProfileHeader = ({ member }: ProfileHeaderProps) => {
	const { t } = useTranslation();

	const getMemberTypeColor = (type: MemberType) => {
		switch (type) {
			case MemberType.ORGANIZER:
				return 'bg-purple-100 text-purple-800';
			case MemberType.ADMIN:
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-blue-100 text-blue-800';
		}
	};

	return (
		<div className="bg-card rounded-xl shadow-sm p-6 md:p-8 mb-8">
			<div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
				<div className="relative">
					{member.memberImage ? (
						<img
							src={`${REACT_APP_API_URL}/${member.memberImage}`}
							alt={member.memberFullName ?? t('No image')}
							className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover ring-2 ring-ring/20"
						/>
					) : (
						<div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted flex items-center justify-center ring-2 ring-ring/20">
							<User className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground/50" />
						</div>
					)}
				</div>
				<div className="flex flex-col items-center md:items-start space-y-3">
					<div className="flex flex-col items-center md:items-start gap-2">
						<h1 className="text-2xl md:text-3xl font-semibold text-card-foreground">{member.memberFullName}</h1>
						<div className="flex items-center gap-2">
							<p className="text-muted-foreground text-base md:text-lg">@{member.username}</p>
							<span className={`px-2 py-1 rounded-full text-sm font-medium ${getMemberTypeColor(member.memberType)}`}>
								{member.memberType}
							</span>
						</div>
					</div>
					{member.memberDesc && (
						<p className="text-card-foreground/80 text-base md:text-lg mt-2 max-w-2xl text-center md:text-left">
							{member.memberDesc ?? t('No description')}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
