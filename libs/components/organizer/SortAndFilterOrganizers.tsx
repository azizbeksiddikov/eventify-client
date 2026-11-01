import { useState } from "react";
import { useTranslation } from "next-i18next";
import { ArrowUpDown, X } from "lucide-react";

import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/libs/components/ui/select";

import { organizersSortOptions } from "@/libs/config";
import { OrganizersInquiry } from "@/libs/types/member/member.input";
import { Direction } from "@/libs/enums/common.enum";
import { cn } from "@/libs/utils";
import { FiltersToggle } from "@/libs/components/common/FiltersToggle";
import { useDebouncedText } from "@/libs/hooks/useDebouncedText";

interface SortAndFilterOrganizersProps {
	updateURL: (newSearch: OrganizersInquiry) => void;
	organizerSearch: OrganizersInquiry;
	initialSearch: OrganizersInquiry;
}

const SortAndFilterOrganizers = ({ updateURL, organizerSearch, initialSearch }: SortAndFilterOrganizersProps) => {
	const { t } = useTranslation("organizers");

	const searchHandler = (text: string) => {
		updateURL({
			...organizerSearch,
			page: 1,
			search: {
				text,
			},
		});
	};

	const [searchText, setSearchText] = useDebouncedText(organizerSearch.search?.text ?? "", searchHandler);

	const sortHandler = (value: string) => {
		updateURL({
			...organizerSearch,
			sort: value,
		});
	};

	const toggleDirection = () => {
		updateURL({
			...organizerSearch,
			direction: organizerSearch.direction === Direction.ASC ? Direction.DESC : Direction.ASC,
		});
	};

	const clearAllHandler = () => {
		updateURL(initialSearch);
	};

	// Phones: only the search box shows; sort and direction open behind a "Filters" button.
	const [filtersOpen, setFiltersOpen] = useState(false);
	const activeFilterCount =
		(organizerSearch.sort !== initialSearch.sort ? 1 : 0) +
		(organizerSearch.direction !== initialSearch.direction ? 1 : 0);
	const phoneHidden = !filtersOpen && "max-sm:hidden";

	return (
		<div className="rounded-2xl shadow-lg p-3 sm:p-6 relative border-2 bg-background/70 backdrop-blur-md w-full max-w-5xl mx-auto">
			<div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
				{/* Left: search */}
				<div className="flex min-w-0 flex-1 gap-2">
					<Input
						type="search"
						enterKeyHint="search"
						aria-label={t("search_by_name_description")}
						placeholder={t("search_by_name_description")}
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

				{/* Right: Sort + Direction + Clear */}
				<div
					className={cn(
						phoneHidden,
						"grid grid-cols-[1fr_auto_auto] gap-2 sm:gap-4 sm:grid-cols-3 lg:flex lg:items-center lg:justify-end lg:gap-4 lg:flex-none",
					)}
				>
					<Select value={organizerSearch.sort} onValueChange={sortHandler}>
						<SelectTrigger className="h-11 data-[size=default]:h-11 w-full sm:min-w-[160px]">
							<ArrowUpDown className="text-muted-foreground mr-2" />
							<SelectValue placeholder={t("sort_by")} />
						</SelectTrigger>
						<SelectContent>
							{organizersSortOptions.map((option) => (
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
								organizerSearch.direction === Direction.ASC
									? "text-lg font-bold text-primary"
									: "text-muted-foreground",
							)}
						>
							↑
						</span>
						<span
							className={cn(
								organizerSearch.direction === Direction.DESC
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
};

export default SortAndFilterOrganizers;
