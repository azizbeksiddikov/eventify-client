import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/libs/components/ui/button';
import { REACT_APP_API_URL } from '@/libs/config';
import { Avatar, AvatarFallback, AvatarImage } from '@/libs/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/libs/components/ui/card';
import { Heart, Calendar, Users, ExternalLink, Mail, User } from 'lucide-react';
import { Member } from '@/libs/types/member/member';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/libs/components/ui/tooltip';

interface OrganizerCardProps {
	organizer: Member;
	likeHandler: (memberId: string) => void;
	subscribeHandler: (memberId: string) => void;
	unsubscribeHandler: (memberId: string) => void;
}

const OrganizerCard = ({ organizer, likeHandler, subscribeHandler, unsubscribeHandler }: OrganizerCardProps) => {
	const router = useRouter();
	const { t } = useTranslation('common');

	const navigateToProfile = () => {
		router.push(`/organizers/${organizer._id}`);
	};

	return (
		<Card className="w-full mx-auto shadow-md hover:shadow-lg transition-all duration-300 bg-card/60 flex flex-col h-full group overflow-hidden">
			<CardHeader className="py-4 flex-shrink-0">
				<div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
					<Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-card shadow-lg ring-2 ring-primary/20">
						<AvatarImage src={`${REACT_APP_API_URL}/${organizer?.memberImage}`} alt={organizer.memberFullName} />
						<AvatarFallback className="bg-primary/10 text-primary">
							<User className="h-8 w-8 sm:h-10 sm:w-10" />
						</AvatarFallback>
					</Avatar>

					<div className="space-y-2 pt-0 sm:pt-3 text-center sm:text-left">
						<h3 className="flex items-center justify-center sm:justify-start font-semibold text-lg sm:text-xl tracking-tight gap-2">
							<User className="h-4 w-4 sm:h-5 sm:w-5 text-primary/70" />
							{organizer.memberFullName}
						</h3>
						<div className="flex items-center justify-center sm:justify-start text-sm text-muted-foreground gap-2">
							<Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary/70" />
							<span className="truncate max-w-[180px]">{organizer.memberEmail}</span>
						</div>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-4 sm:space-y-5 pb-4 flex-1 min-h-0">
				<div className="grid grid-cols-3 gap-2 p-2 sm:p-3 bg-muted/50 rounded-xl">
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-md bg-card/70 hover:bg-card transition-colors cursor-help">
								<Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
								<p className="text-sm sm:text-base font-medium">{organizer.eventOrganizedCount || 0}</p>
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">{t('Events organized')}</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-md bg-card/70 hover:bg-card transition-colors cursor-help">
								<Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
								<p className="text-sm sm:text-base font-medium">{organizer.memberFollowers || 0}</p>
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">{t('People following this organizer')}</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-md bg-card/70 hover:bg-card transition-colors cursor-help">
								<Heart className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
								<p className="text-sm sm:text-base font-medium">{organizer.memberLikes || 0}</p>
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">{t('Total likes received')}</TooltipContent>
					</Tooltip>
				</div>

				<div className="px-1">
					<div className="relative">
						<div className="bg-muted/30 p-2 sm:p-3 rounded-lg">
							{organizer.memberDesc ? (
								<p className="text-xs sm:text-sm text-foreground leading-relaxed line-clamp-3">
									{organizer.memberDesc}
								</p>
							) : (
								<p className="text-xs sm:text-sm text-muted-foreground italic flex items-center justify-center py-2">
									<span className="bg-muted/50 px-2 sm:px-3 py-1 rounded-md">{t('No description available')}</span>
								</p>
							)}
						</div>
					</div>
				</div>
			</CardContent>

			<CardFooter className="pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto flex-shrink-0">
				<Button
					variant="ghost"
					size="sm"
					className={`w-full sm:w-auto h-9 sm:h-10 px-3 sm:px-4 font-medium transition-all rounded-lg ${organizer?.meLiked?.[0]?.myFavorite ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-50/30' : 'hover:text-rose-500 hover:bg-rose-50/20'}`}
					onClick={() => {
						likeHandler(organizer._id);
					}}
				>
					<Heart
						className={`h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 transition-all ${organizer?.meLiked?.[0]?.myFavorite ? 'fill-current stroke-current' : ''}`}
					/>
					{organizer?.meLiked?.[0]?.myFavorite ? t('Liked') : t('Like')}
				</Button>

				<Button
					variant={organizer?.meFollowed?.[0]?.myFollowing ? 'outline' : 'default'}
					size="sm"
					className={`w-full sm:w-auto h-9 sm:h-10 px-3 sm:px-4 font-medium transition-all rounded-lg ${organizer?.meFollowed?.[0]?.myFollowing ? 'border-primary/30 text-primary hover:bg-primary/5' : ''}`}
					onClick={() => {
						if (organizer?.meFollowed?.[0]?.myFollowing) {
							unsubscribeHandler(organizer._id);
						} else {
							subscribeHandler(organizer._id);
						}
					}}
				>
					{organizer?.meFollowed?.[0]?.myFollowing ? t('Following') : t('Follow')}
				</Button>

				<Button
					variant="outline"
					size="sm"
					className="w-full sm:w-auto h-9 sm:h-10 rounded-lg hover:bg-primary/5 border-primary/30 text-primary transition-colors"
					onClick={navigateToProfile}
				>
					<ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
					{t('View Profile')}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default OrganizerCard;
