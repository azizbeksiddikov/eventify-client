import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Heart, Eye, Calendar, Users, Bookmark } from 'lucide-react';

import { Button } from '@/libs/components/ui/button';
import { Badge } from '@/libs/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { Group } from '@/libs/types/group/group';
import { REACT_APP_API_URL } from '@/libs/config';

interface ChosenGroupDataProps {
	group: Group | null;
	likeGroupHandler: (groupId: string) => void;
	joinGroupHandler: (groupId: string) => void;
	leaveGroupHandler: (groupId: string) => void;
}

const ChosenGroupData = ({ group, likeGroupHandler, joinGroupHandler, leaveGroupHandler }: ChosenGroupDataProps) => {
	const { t } = useTranslation('common');

	if (!group) return null;

	/** HANDLERS */

	const handleLike = () => {
		likeGroupHandler(group._id);
	};

	const handleJoin = () => {
		if (isJoined) {
			leaveGroupHandler(group._id);
		} else {
			joinGroupHandler(group._id);
		}
	};

	const isOwner = group.meOwner ?? false;
	const isLiked = group.meLiked && group.meLiked.length > 0;
	const isJoined = group.meJoined && group.meJoined.length > 0;
	const likesCount = group.groupLikes;

	return (
		<div className="lg:col-span-2">
			<Card className="overflow-hidden">
				<div className="relative h-[400px] w-full group">
					<Image
						src={`${REACT_APP_API_URL}/${group.groupImage}`}
						alt={group.groupName}
						fill
						className="object-cover transition-transform duration-300"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300" />
				</div>
				<CardContent className="p-8">
					<CardHeader className="p-0 mb-8">
						<CardTitle className="text-4xl font-semibold tracking-tight mb-2">{group.groupName}</CardTitle>
						<div className="flex items-center space-x-2">
							{group.groupCategories.map((category) => (
								<Badge
									key={category}
									variant="secondary"
									className="hover:bg-secondary/70 transition-colors duration-200"
								>
									#{category}
								</Badge>
							))}
						</div>
					</CardHeader>
					<div className="flex items-center space-x-6 mb-8">
						<Button
							variant="ghost"
							onClick={handleLike}
							className={`flex items-center space-x-2 transition-all duration-200 group ${
								isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-primary'
							}`}
						>
							<Heart
								className={`h-5 w-5 transition-all duration-200 ${
									isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground group-hover:text-primary'
								}`}
							/>
							<span className="text-sm">
								{likesCount} {t('likes')}
							</span>
						</Button>
						<div className="flex items-center space-x-2 text-muted-foreground">
							<Eye className="h-5 w-5" />
							<span className="text-sm">
								{group.groupViews} {t('views')}
							</span>
						</div>
						<div className="flex items-center space-x-2 text-muted-foreground">
							<Users className="h-5 w-5" />
							<span className="text-sm">
								{group.memberCount} {t('members')}
							</span>
						</div>
						<div className="flex items-center space-x-2 text-muted-foreground">
							<Calendar className="h-5 w-5" />
							<span className="text-sm">
								{group.eventsCount} {t('events')}
							</span>
						</div>
					</div>
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
								<Bookmark className="w-5 h-5 text-muted-foreground" />
								{t('About')}
							</h3>
							<p className="text-muted-foreground leading-relaxed whitespace-pre-line">{group.groupDesc}</p>
						</div>
						<div className="flex items-center space-x-3 text-muted-foreground">
							<Calendar className="h-5 w-5" />
							<span>
								{t('Created')} {new Date(group.createdAt).toLocaleDateString()}
							</span>
						</div>
					</div>
					<div className="mt-8 border-t pt-6">
						<Button
							onClick={handleJoin}
							size="lg"
							disabled={isOwner}
							className={`w-full transition-all duration-200 ${
								isOwner
									? 'bg-muted text-muted-foreground cursor-not-allowed'
									: isJoined
										? 'bg-destructive hover:bg-destructive-foreground text-white'
										: 'bg-primary/90 hover:bg-primary text-primary-foreground'
							}`}
						>
							{isOwner ? t('Owner cannot leave group') : isJoined ? t('Leave Group') : t('Join Group')}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ChosenGroupData;
