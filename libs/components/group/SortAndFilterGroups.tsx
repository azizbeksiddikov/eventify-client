import { ArrowUpDown, X } from "lucide-react";
import { useTranslation } from "next-i18next";
import { useState } from "react";

import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/libs/components/ui/select";

import { smallError } from "@/libs/alert";
import { FiltersToggle } from "@/libs/components/common/FiltersToggle";
import { groupsSortOptions } from "@/libs/config";
import { Direction } from "@/libs/enums/common.enum";
import { useDebouncedText } from "@/libs/hooks/useDebouncedText";
import { Group } from "@/libs/types/group/group";
import { GroupsInquiry } from "@/libs/types/group/group.input";
import { cn } from "@/libs/utils";

interface SortAndFilterProps {
	updateURL: (search: GroupsInquiry) => void;
	groupsSearchFilters: GroupsInquiry;
	initialSearch: GroupsInquiry;
}

function SortAndFilterGroups({ updateURL, groupsSearchFilters, initialSearch }: SortAndFilterProps) {
	const { t } = useTranslation("groups");

	const searchHandler = (text: string) => {
		updateURL({
			...groupsSearchFilters,
			page: 1,
			search: {
				...groupsSearchFilters.search,
				text: text,
			},
		});
	};

	const [searchText, setSearchText] = useDebouncedText(groupsSearchFilters.search?.text ?? "", searchHandler);

	const sortHandler = (value: string) => {
		const sortOption = groupsSortOptions.find((option) => option.value === value);

		if (!sortOption) smallError(t("errors:invalid_sort_option"));

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

	// Phones: only the search box shows; sort and direction open behind a "Filters" button.
	const [filtersOpen, setFiltersOpen] = useState(false);
	const activeFilterCount =
		(groupsSearchFilters.sort !== initialSearch.sort ? 1 : 0) +
		(groupsSearchFilters.direction !== initialSearch.direction ? 1 : 0);
	const phoneHidden = !filtersOpen && "max-sm:hidden";

	return (
		<div className="rounded-2xl shadow-lg p-3 sm:p-6 relative border-2 bg-background/70 backdrop-blur-md w-full max-w-5xl mx-auto">
			<div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
				{/* Left: search */}
				<div className="flex min-w-0 flex-1 gap-2">
					<Input
						type="search"
						enterKeyHint="search"
						aria-label={t("search_groups")}
						placeholder={t("search_groups")}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						className="h-11 w-full shrink lg:w-96 bg-background/80 backdrop-blur-sm transition-colors hover:bg-accent/50"
					/>
					<FiltersToggle
						label={t("filters")}
						open={filtersOpen}
						count={activeFilterCount}
						onToggle={() => setFiltersOpen((v) => !v)}
					/>
				</div>

				{/* Right: sort + direction + clear */}
				<div
					className={cn(
						phoneHidden,
						"grid grid-cols-[1fr_auto_auto] gap-2 sm:gap-4 sm:grid-cols-3 lg:flex lg:items-center lg:justify-end lg:gap-4 lg:flex-none",
					)}
				>
					<Select value={groupsSearchFilters.sort} onValueChange={sortHandler}>
						<SelectTrigger className="h-11 data-[size=default]:h-11 w-full sm:min-w-[160px]">
							<ArrowUpDown className="text-muted-foreground mr-2" />
							<SelectValue placeholder={t("sort_by")} />
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
						className="w-11 sm:w-full lg:w-14 h-11 bg-background/80 backdrop-blur-sm hover:bg-accent/50 transition-colors"
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
						aria-label={t("clear")}
						className="w-11 px-0 sm:w-full sm:px-4 lg:w-auto h-11 hover:bg-accent hover:text-accent-foreground"
					>
						<X className="h-4 w-4 sm:mr-2" />
						<span className="hidden sm:inline">{t("clear")}</span>
					</Button>
				</div>
			</div>
		</div>
	);
}

export default SortAndFilterGroups;
