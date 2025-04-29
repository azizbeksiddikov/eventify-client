import { MemberType } from '@/libs/enums/member.enum';
import { Shield, User, Star } from 'lucide-react';

interface MemberTypeBadgeProps {
	memberType: MemberType;
	size?: 'sm' | 'md' | 'lg';
}

export const MemberTypeBadge = ({ memberType, size = 'md' }: MemberTypeBadgeProps) => {
	const sizeClasses = {
		sm: 'h-3 w-3 p-0.5',
		md: 'h-4 w-4 p-1',
		lg: 'h-5 w-5 p-1',
	};

	const iconSize = {
		sm: 'h-2 w-2',
		md: 'h-2.5 w-2.5',
		lg: 'h-3 w-3',
	};

	const getBadgeContent = () => {
		switch (memberType) {
			case MemberType.ADMIN:
				return {
					icon: <Shield className={iconSize[size]} />,
					bgColor: 'bg-red-500',
				};
			case MemberType.ORGANIZER:
				return {
					icon: <Star className={iconSize[size]} />,
					bgColor: 'bg-blue-500',
				};
			default:
				return {
					icon: <User className={iconSize[size]} />,
					bgColor: 'bg-gray-500',
				};
		}
	};

	const { icon, bgColor } = getBadgeContent();

	return (
		<div
			className={`
				${bgColor} 
				${sizeClasses[size]} 
				rounded-full 
				text-white 
				flex 
				items-center 
				justify-center
				absolute
				bottom-0
				right-0
				ring-1
				ring-white
				shadow-sm
			`}
		>
			{icon}
		</div>
	);
};
