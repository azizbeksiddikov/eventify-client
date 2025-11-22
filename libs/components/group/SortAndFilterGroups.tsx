import { useTranslation } from "next-i18next";
import { ArrowUpDown, X } from "lucide-react";

import { Button, buttonVariants } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/libs/components/ui/select";

import { groupsSortOptions } from "@/libs/config";
import { cn } from "@/libs/utils";
import { smallError } from "@/libs/alert";
import { Direction, Message } from "@/libs/enums/common.enum";
import { GroupsInquiry } from "@/libs/types/group/group.input";
import { Group } from "@/libs/types/group/group";

interface SortAndFilterProps {
	updateURL: (search: GroupsInquiry) => void;
	groupsSearchFilters: GroupsInquiry;
	initialSearch: GroupsInquiry;
}

function SortAndFilterGroups({ updateURL, groupsSearchFilters, initialSearch }: SortAndFilterProps) {
	const { t } = useTranslation("common");

	const searchHandler = (text: string) => {
		updateURL({
			...groupsSearchFilters,
			search: {
				...groupsSearchFilters.search,
				text: text,
			},
		});
	};

	const sortHandler = (value: string) => {
		const sortOption = groupsSortOptions.find((option) => option.value === value);

		if (!sortOption) smallError(t(Message.INVALID_SORT_OPTION));

		updateURL({
			...groupsSearchFilters,
			sort: sortOption?.value as keyof Group,
		});
	};

	const toggleDirection = () => {
		updateURL({
			...groupsSearchFilters,
			direction: groupsSearchFilters.direction === Direction.ASC ? Direction.DESC : Direction.ASC,
		});
	};

	const clearAllHandler = () => {
		updateURL(initialSearch);
	};

	return (
		<div className="rounded-2xl shadow-lg p-6 relative border-2  /80 bg-background/70 backdrop-blur-md w-full max-w-5xl mx-auto">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-10">
				{/* 🔍 Search Bar */}
				<Input
					placeholder={t("Search groups...")}
					value={groupsSearchFilters.search?.text}
					onChange={(e) => searchHandler(e.target.value)}
					className={cn(
						buttonVariants({ variant: "ghost", size: "icon" }),
						"w-full sm:w-auto bg-background/80 backdrop-blur-sm  /50 transition-colors hover:bg-accent/50",
					)}
				/>

				{/* 🔽 Sort + Direction + Clear */}
				<div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
					<Select value={groupsSearchFilters.sort} onValueChange={sortHandler}>
						<SelectTrigger className="h-11 min-w-[120px]">
							<ArrowUpDown className="text-muted-foreground mr-2" />
							<SelectValue placeholder={t("Sort by")} />
						</SelectTrigger>
						<SelectContent>
							{groupsSortOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{t(option.label)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Button
						variant="outline"
						size="icon"
						onClick={toggleDirection}
						className="w-14 h-11 bg-background/80 backdrop-blur-sm  /50 hover:bg-accent/50 transition-colors"
					>
						<span
							className={cn(
								groupsSearchFilters.direction === Direction.ASC
									? "text-lg font-bold text-primary"
									: "text-muted-foreground",
							)}
						>
							↑
						</span>
						<span
							className={cn(
								groupsSearchFilters.direction === Direction.DESC
									? "text-lg font-bold text-primary"
									: "text-muted-foreground",
							)}
						>
							↓
						</span>
					</Button>

					<Button
						variant="outline"
						onClick={clearAllHandler}
						className="h-11 hover:bg-accent hover:text-accent-foreground"
					>
						<X className="h-4 w-4 mr-2" />
						{t("Clear")}
					</Button>
				</div>
			</div>
		</div>
	);
}

export default SortAndFilterGroups;
