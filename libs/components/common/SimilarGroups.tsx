import Image from "next/image";
import { useTranslation } from "next-i18next";
import Link from "next/link";

import { Users, Calendar } from "lucide-react";
import { Group } from "@/libs/types/group/group";
import { Card } from "@/libs/components/ui/card";

import { NEXT_APP_API_URL } from "@/libs/config";

interface SimilarGroupsProps {
	groups: Group[];
	text?: string;
}

const SimilarGroups = ({ groups, text = "similar_groups" }: SimilarGroupsProps) => {
	const { t } = useTranslation("groups");

	return (
		<Card className="p-4 bg-card border shadow-sm rounded-2xl">
			<h2 className="text-sm font-black mb-4 text-foreground flex items-center gap-2 uppercase tracking-[0.1em]">
				<Users className="w-4 h-4 text-primary" />
				{t(text)}
			</h2>

			<div className="space-y-2">
				{groups.map((group) => (
					<Link
						key={group._id}
						href={`/groups/${group._id}`}
						className="block group p-2 rounded-xl hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-primary/10"
					>
						<div className="flex items-center gap-3">
							{/* Image */}
							<div className="flex-shrink-0">
								<div className="w-10 h-10 rounded-lg overflow-hidden relative shadow-sm">
									<Image
										src={`${NEXT_APP_API_URL}/${group.groupImage}`}
										alt={group.groupName}
										fill
										className="object-cover group-hover:scale-110 transition-transform duration-300"
									/>
								</div>
							</div>

							{/* Group Details */}
							<div className="flex-1 min-w-0">
								<h4 className="text-[13px] font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
									{group.groupName}
								</h4>

								{/* Stats */}
								<div className="flex items-center gap-3 mt-0.5">
									<div className="flex items-center gap-1">
										<Users className="w-3 h-3 text-muted-foreground/70" />
										<span className="text-[10px] font-black text-muted-foreground/70 tabular-nums">
											{group.memberCount}
										</span>
									</div>
									<div className="flex items-center gap-1">
										<Calendar className="w-3 h-3 text-muted-foreground/70" />
										<span className="text-[10px] font-black text-muted-foreground/70 tabular-nums">
											{group.eventsCount}
										</span>
									</div>
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
