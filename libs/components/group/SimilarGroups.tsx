import { Card } from '../ui/card';
import { Group } from '@/libs/types/group/group';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { Users, Calendar } from 'lucide-react';

interface SimilarGroupsProps {
	similarGroups: Group[];
}

const SimilarGroups = ({ similarGroups }: SimilarGroupsProps) => {
	return (
		<Card className="p-8 bg-card hover:bg-secondary/90 transition-all duration-300 shadow-sm hover:shadow-md border border-border/50">
			<h2 className="text-2xl font-semibold mb-6 text-card-foreground flex items-center gap-2">
				<Users className="w-5 h-5 text-card-foreground" />
				Similar Groups
			</h2>
			<div className="space-y-6">
				{similarGroups.map((similarGroup) => (
					<Link
						key={similarGroup._id}
						href={`/groups/${similarGroup._id}`}
						className="block group hover:scale-105 transition-transform duration-300"
					>
						<div className="flex items-center space-x-6">
							<div className="flex-shrink-0">
								<div className="w-20 h-20 rounded-xl overflow-hidden relative">
									<Image
										src={similarGroup.groupImage}
										alt={similarGroup.groupName}
										fill
										className="object-cover group-hover:scale-105 transition-transform duration-200"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
								</div>
							</div>
							<div className="space-y-2">
								<h3 className="text-xl font-semibold text-card-foreground group-hover:text-card-foreground transition-colors duration-200">
									{similarGroup.groupName}
								</h3>
								<div className="flex items-center space-x-6">
									<div className="flex items-center gap-2 text-sm text-card-foreground">
										<Users className="w-4 h-4 text-card-foreground/70" />
										<span>{similarGroup.memberCount} members</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-card-foreground">
										<Calendar className="w-4 h-4 text-card-foreground/70" />
										<span>{similarGroup.eventsCount} events</span>
									</div>
								</div>
								<div className="flex items-center space-x-2 pt-2">
									{similarGroup.groupCategories.map((category) => (
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
