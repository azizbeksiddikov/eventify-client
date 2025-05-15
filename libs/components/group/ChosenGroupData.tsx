import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { Heart, Eye, Calendar, Bookmark, Users, Ticket, Pencil } from 'lucide-react';

import { Button } from '@/libs/components/ui/button';
import { Badge } from '@/libs/components/ui/badge';
import { Card } from '@/libs/components/ui/card';
import { Separator } from '@/libs/components/ui/separator';

import { REACT_APP_API_URL } from '@/libs/config';
import { cn } from '@/libs/utils';
import { Group } from '@/libs/types/group/group';

interface ChosenGroupDataProps {
	group: Group | null;
	userId: string;
	likeGroupHandler: (groupId: string) => void;
	joinGroupHandler: (groupId: string) => void;
	leaveGroupHandler: (groupId: string) => void;
}

const ChosenGroupData = ({
	userId,
	group,
	likeGroupHandler,
	joinGroupHandler,
	leaveGroupHandler,
}: ChosenGroupDataProps) => {
	const { t } = useTranslation('common');
	const router = useRouter();

	if (!group) return null;

	/** HANDLERS */
	const joinHandler = () => {
		if (isJoined) {
			leaveGroupHandler(group._id);
		} else {
			joinGroupHandler(group._id);
		}
	};

	const isOwner = userId === group.memberId;
	const isModerator = group.groupModerators?.some((moderator) => moderator.memberId === userId);
	const isLiked = group.meLiked && group.meLiked.length > 0;
	const isJoined = group.meJoined && group.meJoined.length > 0;

	return (
		<Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl gap-0 py-0">
			{/* Section: Group Data */}
			<div className="relative">
				{/* Edit Button */}
				{(isOwner || isModerator) && (
					<Button
						variant="secondary"
						size="sm"
						className="absolute top-4 right-4 z-10 h-9 bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 hover:scale-105 transition-all duration-200"
						onClick={() => router.push(`/group/update?groupId=${group._id}`)}
					>
						<Pencil className="h-4 w-4 mr-1.5" />
						{t('Edit')}
					</Button>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 pb-4">
					{/* Group Name and Image */}
					<div className="relative w-full flex flex-col justify-start items-start">
						<h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-3 text-left">
							{group.groupName}
						</h2>

						{/* Event Image */}
						<div className="relative aspect-[16/9] w-full group rounded-xl overflow-hidden border-border border-2">
							<Image
								src={`${REACT_APP_API_URL}/${group.groupImage}`}
								alt={group.groupName}
								fill
								className="object-contain transition-transform duration-500"
								sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
							<div className="absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-t from-black/60 to-transparent rounded-b-xl" />
							<div className="absolute bottom-4 left-4">
								<Badge
									variant="secondary"
									className="bg-primary text-primary-foreground backdrop-blur-sm shadow-md px-3 py-1 font-medium"
								>
									{group.memberCount} {t('members')}
								</Badge>
							</div>
							<div className="absolute bottom-4 right-4">
								<Badge
									variant="secondary"
									className="bg-primary text-primary-foreground backdrop-blur-sm shadow-md px-3 py-1 font-medium"
								>
									{group.eventsCount} {t('events')}
								</Badge>
							</div>
						</div>
					</div>

					<div className="space-y-6 flex flex-col justify-between">
						{/* Group Info */}
						<div className="space-y-5">
							{/* Group Categories */}
							<div className="flex flex-wrap gap-2 mt-3">
								{group.groupCategories.map((category) => (
									<Badge
										key={category}
										variant="outline"
										className="text-xs font-medium border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors px-2 sm:px-3 py-1 rounded-full"
									>
										{category}
									</Badge>
								))}
							</div>

							{/* Group Stats */}
							<div className="space-y-3">
								{/* Created Date */}
								<div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors bg-muted/40 hover:bg-muted/50 p-3 rounded-xl">
									<Calendar className="h-5 w-5 flex-shrink-0 text-primary" />
									<span className="font-medium">
										{t('Created')}{' '}
										{new Date(group.createdAt).toLocaleDateString('en-US', {
											weekday: 'short',
											month: 'short',
											day: 'numeric',
											year: 'numeric',
										})}
									</span>
								</div>

								{/* Members Count */}
								<div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors bg-muted/40 hover:bg-muted/50 p-3 rounded-xl">
									<Users className="h-5 w-5 flex-shrink-0 text-primary" />
									<span className="font-medium">
										{group.memberCount} {t('members')}
									</span>
								</div>

								{/* Events Count */}
								<div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors bg-muted/40 hover:bg-muted/50 p-3 rounded-xl">
									<Ticket className="h-5 w-5 flex-shrink-0 text-primary" />
									<span className="font-medium">
										{group.eventsCount} {t('events')}
									</span>
								</div>
							</div>

							{/* Group Likes and Views */}
							<div className="grid grid-cols-2 gap-2 pt-2 h-10">
								<Button
									onClick={() => likeGroupHandler(group._id)}
									className={cn(
										'flex h-auto items-center m-0 p-0 gap-2 transition-all duration-200 bg-muted/40 hover:bg-muted/50 rounded-xl',
										isLiked ? 'text-destructive hover:text-destructive/90' : 'text-muted-foreground hover:text-primary',
									)}
								>
									<Heart
										className={cn(
											'h-5 w-5 transition-all duration-200',
											isLiked ? 'fill-destructive text-destructive' : 'text-primary/70',
										)}
									/>
									<span className="font-medium">{group.groupLikes}</span>
								</Button>

								{/* Group Views */}
								<div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted/40 hover:bg-muted/50 transition-colors rounded-xl">
									<Eye className="h-5 w-5 text-primary/70" />
									<span className="font-medium">{group.groupViews}</span>
								</div>
							</div>
						</div>

						{/* Join/Leave Button */}
						<div className="bg-accent/30 p-4 rounded-xl">
							<Button
								onClick={joinHandler}
								size="lg"
								disabled={isOwner}
								className={cn(
									'w-full transition-all duration-200',
									isOwner
										? 'bg-muted text-muted-foreground cursor-not-allowed'
										: isJoined
											? 'bg-destructive hover:bg-destructive/90 text-white'
											: 'bg-primary hover:bg-primary/90 text-primary-foreground',
								)}
							>
								{isOwner ? t('Owner cannot leave group') : isJoined ? t('Leave Group') : t('Join Group')}
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Section: Description */}
			<Separator />
			<div className="px-6 py-4">
				<h3 className="text-sm font-medium mb-2 text-foreground/90 flex items-center gap-2">
					<Bookmark className="w-4 h-4" />
					{t('About')}
				</h3>
				<p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{group.groupDesc}</p>
			</div>
		</Card>
	);
};

export default ChosenGroupData;
