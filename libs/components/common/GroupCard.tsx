import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { Heart, Calendar, Users, ExternalLink, Eye } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { userVar } from '@/apollo/store';

import { Button } from '@/libs/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/libs/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/libs/components/ui/tooltip';
import { Badge } from '@/libs/components/ui/badge';

import { REACT_APP_API_URL } from '@/libs/config';
import { smallError, smallSuccess } from '@/libs/alert';
import { Message } from '@/libs/enums/common.enum';

import { JOIN_GROUP, LEAVE_GROUP, LIKE_TARGET_GROUP } from '@/apollo/user/mutation';
import { Group } from '@/libs/types/group/group';

interface GroupCardProps {
	group: Group;
}

const GroupCard = ({ group }: GroupCardProps) => {
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);

	/** APOLLO */
	const [likeTargetGroup] = useMutation(LIKE_TARGET_GROUP);
	const [joinGroup] = useMutation(JOIN_GROUP);
	const [leaveGroup] = useMutation(LEAVE_GROUP);

	/** HANDLERS **/
	const likeGroupHandler = async (groupId: string) => {
		try {
			if (!groupId) return;
			if (!user._id || user._id === '') throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetGroup({
				variables: { input: groupId },
			});

			await smallSuccess(t('Group liked successfully'));
		} catch (error: unknown) {
			const err = error as Error;
			console.log('ERROR, likeGroupHandler:', err.message);
			smallError(err.message);
		}
	};

	const handleJoinGroup = async (groupId: string) => {
		try {
			if (!groupId) return;
			if (!user._id || user._id === '') throw new Error(Message.NOT_AUTHENTICATED);

			await joinGroup({
				variables: { input: groupId },
			});

			await smallSuccess(t('Group joined successfully'));
		} catch (error: unknown) {
			const err = error as Error;
			console.log('ERROR, handleJoinGroup:', err.message);
			smallError(err.message);
		}
	};

	const handleLeaveGroup = async (groupId: string) => {
		try {
			if (!groupId) return;
			if (!user._id || user._id === '') throw new Error(Message.NOT_AUTHENTICATED);

			await leaveGroup({
				variables: { input: groupId },
			});
		} catch (error: unknown) {
			const err = error as Error;
			console.log('ERROR, handleLeaveGroup:', err.message);
		}
	};

	return (
		<Card className="pt-0 w-full mx-auto shadow-md hover:shadow-lg transition-all duration-300 bg-card/60 flex flex-col h-full group hover:scale-105 gap-0">
			<CardHeader className="p-0 gap-0">
				<div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl">
					<Link href={`/group/detail?groupId=${group._id}`}>
						<Image
							src={`${REACT_APP_API_URL}/${group.groupImage}`}
							alt={group.groupName}
							fill
							className="object-cover transition-transform duration-300"
						/>
					</Link>
					<div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						<Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm">
							<Eye className="w-4 h-4 mr-1.5" />
							{group.groupViews || 0}
						</Badge>
					</div>
					<div className="absolute bottom-3 left-3">
						<Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm">
							<Users className="w-4 h-4 mr-1.5" />
							{group.memberCount || 0}
						</Badge>
					</div>
					<div className="absolute bottom-3 right-3">
						<Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm">
							<Calendar className="w-4 h-4 mr-1.5" />
							{group.eventsCount || 0}
						</Badge>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-3 p-3 flex-1 flex flex-col">
				<div className="space-y-2">
					<h3 className="text-lg font-semibold text-foreground line-clamp-1 h-6">{group.groupName}</h3>

					<div className="flex flex-wrap gap-1 min-h-[20px]">
						{group.groupCategories.map((category, index) => (
							<span key={index} className="text-xs text-primary/90 bg-primary/10 px-2 py-0.5 rounded-full">
								#{category}
							</span>
						))}
					</div>

					<div className="space-y-1.5">
						<div className="flex items-center gap-2 text-sm text-muted-foreground h-5">
							<Calendar className="w-4 h-4 flex-shrink-0" />
							<span>{new Date(group.createdAt).toLocaleDateString()}</span>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-1.5 p-2 bg-muted/50 rounded-lg mt-1">
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center gap-1.5 p-1.5 rounded-md bg-card/70 hover:bg-card transition-colors cursor-help">
								<Users className="h-3.5 w-3.5 text-primary" />
								<p className="text-xs font-medium">{group.memberCount || 0}</p>
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">{t('Total group members')}</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center gap-1.5 p-1.5 rounded-md bg-card/70 hover:bg-card transition-colors cursor-help">
								<Calendar className="h-3.5 w-3.5 text-primary" />
								<p className="text-xs font-medium">{group.eventsCount || 0}</p>
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">{t('Total events organized')}</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center gap-1.5 p-1.5 rounded-md bg-card/70 hover:bg-card transition-colors cursor-help">
								<Heart className="h-3.5 w-3.5 text-primary" />
								<p className="text-xs font-medium">{group.groupLikes || 0}</p>
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">{t('Total likes received')}</TooltipContent>
					</Tooltip>
				</div>

				<div className="px-0.5 mt-1">
					<div className="relative">
						<div className="bg-muted/30 p-2 rounded-lg min-h-[48px] flex items-center">
							{group.groupDesc ? (
								<p className="text-xs text-foreground leading-relaxed line-clamp-2">{group.groupDesc}</p>
							) : (
								<p className="text-xs text-muted-foreground italic flex items-center justify-center py-1 w-full">
									<span className="bg-muted/50 px-2 py-0.5 rounded-md">{t('No description available')}</span>
								</p>
							)}
						</div>
					</div>
				</div>
			</CardContent>

			<CardFooter className="border-t border-border flex items-center justify-between gap-2 py-0 my-0">
				<Button
					variant="ghost"
					size="sm"
					className={`h-8 px-3 font-medium transition-all ${group?.meLiked?.[0]?.myFavorite ? 'text-rose-500' : ''}`}
					onClick={() => likeGroupHandler(group._id)}
				>
					<Heart
						className={`h-3.5 w-3.5 mr-1 transition-all ${group?.meLiked?.[0]?.myFavorite ? 'fill-current stroke-current' : ''}`}
					/>
					{group?.meLiked?.[0]?.myFavorite ? t('Liked') : t('Like')}
				</Button>

				<Button
					variant={group?.meJoined?.[0]?.meJoined ? 'outline' : 'default'}
					size="sm"
					className={`h-8 px-3 font-medium transition-all ${group?.meJoined?.[0]?.meJoined ? 'border-primary/30 text-primary hover:bg-primary/5' : ''}`}
					onClick={() => (group?.meJoined?.[0]?.meJoined ? handleLeaveGroup(group._id) : handleJoinGroup(group._id))}
				>
					{group?.meJoined?.[0]?.meJoined ? t('Leave') : t('Join')}
				</Button>

				<Link href={`/group/detail?groupId=${group._id}`}>
					<Button
						variant="outline"
						size="sm"
						className="h-8 rounded-lg hover:bg-primary/5 border-primary/30 text-primary transition-colors"
					>
						<ExternalLink className="h-3.5 w-3.5 mr-1" />
						{t('View')}
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};

export default GroupCard;
