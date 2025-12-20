import Image from "next/image";
import { useTranslation } from "next-i18next";
import Link from "next/link";

import { Users, Calendar } from "lucide-react";
import { Group } from "@/libs/types/group/group";
import { Card } from "@/libs/components/ui/card";
import { Badge } from "@/libs/components/ui/badge";

import { NEXT_APP_API_URL } from "@/libs/config";

interface SimilarGroupsProps {
	groups: Group[];
	text?: string;
}

const SimilarGroups = ({ groups, text = "Similar Groups" }: SimilarGroupsProps) => {
	const { t } = useTranslation("common");

	return (
		<Card className="p-3 sm:p-4 lg:p-6 bg-card hover:bg-secondary/15 transition-all duration-300 shadow-sm hover:shadow-md border  /50">
			<h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-card-foreground flex items-center gap-2">
				<Users className="w-4 h-4 text-card-foreground" />
				{t(text)}
			</h2>

			<div className="space-y-2 sm:space-y-3">
				{groups.map((group) => (
					<Link
						key={group._id}
						href={`/groups/${group._id}`}
						className="block group hover:scale-[1.01] transition-all duration-300 p-2 sm:p-3 lg:p-2 xl:p-3 rounded-lg hover:bg-secondary/20 hover:border-l-2 sm:hover:border-l-4 hover:border-l-primary"
					>
						<div className="flex items-start sm:items-center gap-2 sm:gap-3 lg:gap-2 xl:gap-3">
							{/* Image */}
							<div className="flex-shrink-0">
								<div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-md sm:rounded-lg overflow-hidden relative">
									<Image
										src={`${NEXT_APP_API_URL}/${group.groupImage}`}
										alt={group.groupName}
										fill
										className="object-cover group-hover:scale-105 transition-transform duration-200"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
								</div>
							</div>

							{/* Group Details */}
							<div className="flex-1 min-w-0">
								<h3 className="text-sm sm:text-base lg:text-sm xl:text-base font-semibold text-card-foreground group-hover:text-card-foreground transition-colors duration-200 line-clamp-1">
									{group.groupName}
								</h3>

								{/* Stats */}
								<div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-4">
									<div className="flex items-center gap-1">
										<Users className="w-3 h-3 text-card-foreground/70" />
										<span className="text-xs text-card-foreground/70">
											{group.memberCount} {t("members")}
										</span>
									</div>
									<div className="flex items-center gap-1">
										<Calendar className="w-3 h-3 text-card-foreground/70" />
										<span className="text-xs text-card-foreground/70">
											{group.eventsCount} {t("events")}
										</span>
									</div>
								</div>

								{/* Categories */}
								<div className="flex flex-wrap items-center gap-1 mt-2">
									{group.groupCategories.slice(0, 3).map((category) => (
										<Badge
											key={category}
											className="px-1.5 py-0.5 text-xs leading-tight bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 transition-colors duration-200"
										>
											#{category}
										</Badge>
									))}
									{group.groupCategories.length > 3 && (
										<span className="text-xs text-muted-foreground">+{group.groupCategories.length - 3}</span>
									)}
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
