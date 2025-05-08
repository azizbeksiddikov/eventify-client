import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { Users, Calendar } from 'lucide-react';
import { Group } from '@/libs/types/group/group';
import { Card } from '@/libs/components/ui/card';
import { Badge } from '@/libs/components/ui/badge';

import { REACT_APP_API_URL } from '@/libs/config';

interface SimilarGroupsProps {
	groups: Group[];
	text?: string;
}

const SimilarGroups = ({ groups, text = 'Similar Groups' }: SimilarGroupsProps) => {
	const { t } = useTranslation('common');

	return (
		<Card className="p-8 bg-card hover:bg-secondary/15 transition-all duration-300 shadow-sm hover:shadow-md border border-border/50">
			<h2 className="text-2xl font-semibold mb-6 text-card-foreground flex items-center gap-2">
				<Users className="w-5 h-5 text-card-foreground" />
				{text}
			</h2>
			<div className="space-y-6">
				{groups.map((group) => (
					<Link
						key={group._id}
						href={`/group/detail?groupId=${group._id}`}
						className="block group hover:scale-[1.02] transition-all duration-300 p-4 rounded-lg hover:bg-secondary/20 hover:border-l-4 hover:border-l-primary"
					>
						<div className="flex items-center space-x-6">
							<div className="flex-shrink-0">
								<div className="w-20 h-20 rounded-xl overflow-hidden relative">
									<Image
										src={`${REACT_APP_API_URL}/${group.groupImage}`}
										alt={group.groupName}
										fill
										className="object-cover group-hover:scale-105 transition-transform duration-200"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
								</div>
							</div>
							<div className="space-y-2">
								<h3 className="text-xl font-semibold text-card-foreground group-hover:text-card-foreground transition-colors duration-200">
									{group.groupName}
								</h3>
								<div className="flex items-center space-x-6">
									<div className="flex items-center gap-2 text-sm text-card-foreground">
										<Users className="w-4 h-4 text-card-foreground/70" />
										<span>
											{group.memberCount} {t('members')}
										</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-card-foreground">
										<Calendar className="w-4 h-4 text-card-foreground/70" />
										<span>
											{group.eventsCount} {t('events')}{' '}
										</span>
									</div>
								</div>
								<div className="flex items-center space-x-2 pt-2">
									{group.groupCategories.map((category) => (
										<Badge
											key={category}
											className="bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 transition-colors duration-200"
										>
											#{category}
										</Badge>
									))}
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>
		</Card>
	);
};

export default SimilarGroups;
