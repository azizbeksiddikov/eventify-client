import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Users, Heart, Eye, Mail, Phone, Calendar, CheckCircle2, Shield, Star, User } from 'lucide-react';

import { Badge } from '@/libs/components/ui/badge';
import { Button } from '@/libs/components/ui/button';

import { REACT_APP_API_GRAPHQL_URL } from '@/libs/config';
import { Member } from '@/libs/types/member/member';
import { MemberType } from '@/libs/enums/member.enum';

interface OrganizerProfileProps {
	organizer: Member;
	likeMemberHandler: (memberId: string) => void;
	subscribeHandler: (memberId: string) => void;
	unsubscribeHandler: (memberId: string) => void;
}

const getMemberTypeBadge = (type: MemberType, t: (key: string) => string) => {
	switch (type) {
		case 'ADMIN':
			return (
				<Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">
					<Shield className="h-3 w-3 mr-1" />
					{t('Admin')}
				</Badge>
			);
		case 'ORGANIZER':
			return (
				<Badge variant="secondary" className="bg-accent/10 text-accent-foreground hover:bg-accent/20">
					<Star className="h-3 w-3 mr-1" />
					{t('Organizer')}
				</Badge>
			);
		case 'USER':
			return (
				<Badge variant="outline" className="border-secondary/20 text-secondary-foreground hover:bg-secondary/5">
					<User className="h-3 w-3 mr-1" />
					{t('User')}
				</Badge>
			);
		default:
			return null;
	}
};

const OrganizerProfile = ({
	organizer,
	likeMemberHandler,
	subscribeHandler,
	unsubscribeHandler,
}: OrganizerProfileProps) => {
	const { t } = useTranslation('common');

	const handleFollow = () => {
		if (organizer?.meFollowed?.[0]?.myFollowing) {
			unsubscribeHandler(organizer._id);
		} else {
			subscribeHandler(organizer._id);
		}
	};

	const handleLike = () => {
		likeMemberHandler(organizer._id);
	};

	return (
		<div className="lg:col-span-2 bg-card rounded-2xl shadow-sm overflow-hidden">
			<div className="relative h-[400px] w-full bg-muted">
				{organizer.memberImage ? (
					<Image
						src={`${REACT_APP_API_GRAPHQL_URL}/${organizer.memberImage}`}
						alt={organizer.memberFullName}
						fill
						className="object-cover"
						priority
					/>
				) : (
					<div className="absolute inset-0 flex items-center justify-center">
						<User className="h-24 w-24 text-muted-foreground/50" />
					</div>
				)}
			</div>
			<div className="p-8">
				<div className="flex justify-between items-start mb-8">
					<div>
						<h1 className="text-4xl font-semibold text-foreground tracking-tight mb-2">{organizer.memberFullName}</h1>
						<div className="flex items-center space-x-2">
							{getMemberTypeBadge(organizer.memberType, t)}
							{organizer.emailVerified && (
								<Badge variant="outline" className="border-green-500/50 text-green-500">
									<CheckCircle2 className="h-3 w-3 mr-1" />
									{t('Verified')}
								</Badge>
							)}
						</div>
					</div>
					<div className="flex items-center space-x-4">
						<Button
							variant={organizer?.meFollowed?.[0]?.myFollowing ? 'outline' : 'default'}
							onClick={handleFollow}
							className="focus:ring-0 focus:border-primary/50"
						>
							{organizer?.meFollowed?.[0]?.myFollowing ? t('Following') : t('Follow')}
						</Button>
						<button
							onClick={handleLike}
							className={`flex items-center space-x-2 transition-all duration-200 ${
								organizer?.meLiked?.[0]?.myFavorite
									? 'text-red-500 hover:text-red-600'
									: 'text-muted-foreground hover:text-primary'
							}`}
						>
							<Heart
								className={`h-5 w-5 transition-all duration-200 ${
									organizer?.meLiked?.[0]?.myFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
								}`}
							/>
							<span className="text-sm">
								{organizer.memberLikes} {t('likes')}
							</span>
						</button>
					</div>
				</div>
				<div className="flex items-center space-x-6 mb-8">
					<div className="flex items-center space-x-2 text-muted-foreground">
						<Eye className="h-5 w-5" />
						<span className="text-sm">
							{organizer.memberViews} {t('views')}
						</span>
					</div>
					<div className="flex items-center space-x-2 text-muted-foreground">
						<Users className="h-5 w-5" />
						<span className="text-sm">
							{organizer.memberFollowers} {t('followers')}
						</span>
					</div>
					<div className="flex items-center space-x-2 text-muted-foreground">
						<Users className="h-5 w-5" />
						<span className="text-sm">
							{organizer.memberFollowings} {t('following')}
						</span>
					</div>
					<div className="flex items-center space-x-2 text-muted-foreground">
						<Calendar className="h-5 w-5" />
						<span className="text-sm">
							{organizer.eventsOrganizedCount} {t('events organized')}
						</span>
					</div>
				</div>
				<div className="prose prose-sm max-w-none text-muted-foreground mb-8">{organizer.memberDesc}</div>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div className="flex items-center space-x-3">
						<Mail className="h-5 w-5 text-muted-foreground" />
						<span className="text-foreground">{organizer.memberEmail}</span>
					</div>
					{organizer.memberPhone && (
						<div className="flex items-center space-x-3">
							<Phone className="h-5 w-5 text-muted-foreground" />
							<span className="text-foreground">{organizer.memberPhone}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default OrganizerProfile;
