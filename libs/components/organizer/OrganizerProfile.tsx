import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { Users, Heart, Eye, Mail, Phone, Calendar, CheckCircle2, Shield, Star, User, Trophy } from 'lucide-react';

import { Badge } from '@/libs/components/ui/badge';
import { Button } from '@/libs/components/ui/button';

import { REACT_APP_API_URL } from '@/libs/config';
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
				<Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
					<Shield className="h-3 w-3 mr-1.5" />
					{t('Admin')}
				</Badge>
			);
		case 'ORGANIZER':
			return (
				<Badge variant="secondary" className="bg-accent/10 text-accent-foreground hover:bg-accent/20 transition-colors">
					<Star className="h-3 w-3 mr-1.5" />
					{t('Organizer')}
				</Badge>
			);
		case 'USER':
			return (
				<Badge
					variant="outline"
					className="border-secondary/20 text-secondary-foreground hover:bg-secondary/5 transition-colors"
				>
					<User className="h-3 w-3 mr-1.5" />
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
		<div className="lg:col-span-2 bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden transition-all duration-200 hover:shadow-md">
			<div className="relative bg-gradient-to-b from-primary/5 to-transparent p-6 md:p-8">
				<div className="flex flex-col md:flex-row gap-6 md:gap-8">
					{/* Left side - Image and Actions */}
					<div className="relative flex-shrink-0 flex flex-col items-center gap-4">
						<div>
							{organizer.memberImage ? (
								<div className="relative w-40 h-40 md:w-48 md:h-48 ring-4 ring-background shadow-lg rounded-full overflow-hidden">
									<Image
										src={`${REACT_APP_API_URL}/${organizer.memberImage}`}
										alt={organizer.memberFullName ?? t('No image')}
										className="object-cover"
										fill
										priority
									/>
								</div>
							) : (
								<div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-muted flex items-center justify-center ring-4 ring-background shadow-lg">
									<User className="h-20 w-20 md:h-24 md:w-24 text-muted-foreground/50" />
								</div>
							)}
						</div>

						<div className="flex items-center gap-3">
							<Button
								variant={organizer?.meFollowed?.[0]?.myFollowing ? 'outline' : 'default'}
								onClick={handleFollow}
								className="min-w-[100px] transition-all duration-200"
							>
								{organizer?.meFollowed?.[0]?.myFollowing ? t('Following') : t('Follow')}
							</Button>
							<button
								onClick={handleLike}
								className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
									organizer?.meLiked?.[0]?.myFavorite
										? 'bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-950'
										: 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-primary'
								}`}
							>
								<Heart
									className={`h-5 w-5 transition-all duration-200 ${
										organizer?.meLiked?.[0]?.myFavorite ? 'fill-red-500 text-red-500' : ''
									}`}
								/>
								<span className="text-sm font-medium">
									{organizer.memberLikes} {t('likes')}
								</span>
							</button>
						</div>
					</div>

					{/* Right side - Content */}
					<div className="flex-1 min-w-0">
						<div className="flex flex-col h-full">
							{/* Top section - Name and Badges */}
							<div className="mb-6">
								<h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-3">
									{organizer.memberFullName}
								</h1>
								<div className="flex flex-wrap items-center gap-2">
									{getMemberTypeBadge(organizer.memberType, t)}
									{organizer.emailVerified && (
										<Badge variant="outline" className="border-green-500/50 text-green-500">
											<CheckCircle2 className="h-3 w-3 mr-1.5" />
											{t('Verified')}
										</Badge>
									)}
									{organizer.memberRank > 0 && (
										<Badge variant="outline" className="border-amber-500/50 text-amber-500">
											<Trophy className="h-3 w-3 mr-1.5" />
											{t('Rank')} #{organizer.memberRank}
										</Badge>
									)}
								</div>
							</div>

							{/* Stats Grid */}
							<div className="grid grid-cols-2 gap-3">
								<div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
									<Eye className="h-5 w-5 text-muted-foreground" />
									<div className="flex flex-col">
										<span className="text-sm font-medium text-foreground">{organizer.memberViews}</span>
										<span className="text-xs text-muted-foreground">{t('views')}</span>
									</div>
								</div>
								<div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
									<Calendar className="h-5 w-5 text-muted-foreground" />
									<div className="flex flex-col">
										<span className="text-sm font-medium text-foreground">{organizer.eventsOrganizedCount}</span>
										<span className="text-xs text-muted-foreground">{t('events organized')}</span>
									</div>
								</div>
								<div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
									<Users className="h-5 w-5 text-muted-foreground" />
									<div className="flex flex-col">
										<span className="text-sm font-medium text-foreground">{organizer.memberFollowers}</span>
										<span className="text-xs text-muted-foreground">{t('followers')}</span>
									</div>
								</div>
								<div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
									<Users className="h-5 w-5 text-muted-foreground" />
									<div className="flex flex-col">
										<span className="text-sm font-medium text-foreground">{organizer.memberFollowings}</span>
										<span className="text-xs text-muted-foreground">{t('following')}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="px-6 md:px-8 py-4 border-t border-border/50">
				{organizer.memberDesc && (
					<div className="prose prose-sm max-w-none text-muted-foreground mb-6 p-4 rounded-lg bg-muted/30">
						{organizer.memberDesc}
					</div>
				)}

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
						<Mail className="h-5 w-5 text-muted-foreground" />
						<span className="text-sm text-foreground">{organizer.memberEmail}</span>
					</div>
					{organizer.memberPhone && (
						<div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
							<Phone className="h-5 w-5 text-muted-foreground" />
							<span className="text-sm text-foreground">{organizer.memberPhone}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default OrganizerProfile;
