import { useTranslation } from "next-i18next";

import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/libs/components/ui/select";

import { GroupCategory } from "@/libs/enums/group.enum";
import { GroupsInquiry } from "@/libs/types/group/group.input";
import { Direction } from "@/libs/enums/common.enum";

interface GroupSearchProps {
	initialInquiry: GroupsInquiry;
	groupsInquiry: GroupsInquiry;
	setGroupsInquiry: (inquiry: GroupsInquiry) => void;
}

export function GroupSearch({ initialInquiry, groupsInquiry, setGroupsInquiry }: GroupSearchProps) {
	const { t } = useTranslation(["admin", "groups"]);

	/**	 HANDLERS */
	const searchTextHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setGroupsInquiry({
			...groupsInquiry,
			search: {
				...groupsInquiry.search,
				text: e.target.value,
			},
		});
	};

	const inputFieldHandler = (field: string, value: number | string) => {
		setGroupsInquiry({
			...groupsInquiry,
			[field]: value,
		});
	};

	const groupCategoryHandler = (value: string) => {
		setGroupsInquiry({
			...groupsInquiry,
			search: {
				...groupsInquiry.search,
				groupCategories: value === "all" ? [] : [value as GroupCategory],
			},
		});
	};

	const clearAllHandler = () => {
		setGroupsInquiry(initialInquiry);
	};

	return (
		<div className="flex items-center gap-6 p-6 rounded-t-lg bg-card border  ">
			{/* SEARCH */}
			<Input
				placeholder={t("search_groups")}
				value={groupsInquiry?.search?.text ?? ""}
				onChange={searchTextHandler}
				className="w-full bg-background text-foreground border-input focus:ring-primary"
			/>

			{/* Category */}
			<Select
				value={groupsInquiry?.search?.groupCategories?.length ? groupsInquiry?.search?.groupCategories[0] : "all"}
				onValueChange={(value) => {
					groupCategoryHandler(value);
				}}
			>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder={t("filter_by_category")} />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground  ">
					<SelectItem value="all">{t("all_categories")}</SelectItem>
					{Object.values(GroupCategory).map((value) => (
						<SelectItem key={value} value={value}>
							{t(`groups:${value.toLowerCase()}`)}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* SORT */}
			<Select
				value={groupsInquiry?.sort}
				onValueChange={(value: string) => {
					inputFieldHandler("sort", value);
				}}
			>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder={t("sort_by")} />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground  ">
					<SelectItem value="createdAt">{t("created_at")}</SelectItem>
					<SelectItem value="memberCount">{t("members")}</SelectItem>
					<SelectItem value="eventsCount">{t("events")}</SelectItem>
					<SelectItem value="groupViews">{t("views_header")}</SelectItem>
				</SelectContent>
			</Select>

			{/* Direction */}
			<Select
				value={groupsInquiry?.direction}
				onValueChange={(value: Direction) => {
					inputFieldHandler("direction", value);
				}}
			>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder={t("direction")} />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground  ">
					<SelectItem value={Direction.ASC}>{t("ascending")}</SelectItem>
					<SelectItem value={Direction.DESC}>{t("descending")}</SelectItem>
				</SelectContent>
			</Select>

			{/* Clear */}
			<Button
				variant="outline"
				onClick={clearAllHandler}
				className="bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
			>
				{t("clear")}
			</Button>
		</div>
	);
}
