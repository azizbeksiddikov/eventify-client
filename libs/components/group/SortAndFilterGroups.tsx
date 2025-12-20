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
		<div className="rounded-2xl shadow-lg p-4 sm:p-6 relative border-2 bg-background/70 backdrop-blur-md w-full max-w-5xl mx-auto">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				{/* Left: search */}
				<div className="min-w-0 flex-1">
					<Input
						placeholder={t("Search groups...")}
						value={groupsSearchFilters.search?.text}
						onChange={(e) => searchHandler(e.target.value)}
						className={cn(
							buttonVariants({ variant: "ghost", size: "icon" }),
							"w-full lg:w-96 bg-background/80 backdrop-blur-sm transition-colors hover:bg-accent/50",
						)}
					/>
				</div>

				{/* Right: sort + direction + clear */}
				<div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:flex lg:items-center lg:justify-end lg:gap-4 lg:flex-none">
					<Select value={groupsSearchFilters.sort} onValueChange={sortHandler}>
						<SelectTrigger className="h-11 w-full col-span-2 sm:col-span-1 sm:min-w-[160px]">
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
						className="w-full lg:w-14 h-11 bg-background/80 backdrop-blur-sm hover:bg-accent/50 transition-colors"
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
						className="w-full lg:w-auto h-11 hover:bg-accent hover:text-accent-foreground"
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
