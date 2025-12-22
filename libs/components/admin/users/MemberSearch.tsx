import { useTranslation } from "next-i18next";

import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/libs/components/ui/select";
import { MembersInquiry } from "@/libs/types/member/member.input";
import { Direction } from "@/libs/enums/common.enum";
import { MemberStatus, MemberType } from "@/libs/enums/member.enum";

interface MemberSearchProps {
	initialInquiry: MembersInquiry;
	membersInquiry: MembersInquiry;
	setMembersInquiry: (inquiry: MembersInquiry) => void;
}

export function MemberSearch({ initialInquiry, membersInquiry, setMembersInquiry }: MemberSearchProps) {
	const { t } = useTranslation("admin");

	/**	 HANDLERS */
	const searchTextHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMembersInquiry({
			...membersInquiry,
			search: {
				...membersInquiry.search,
				text: e.target.value,
			},
		});
	};

	const inputFieldHandler = (field: string, value: number | string) => {
		setMembersInquiry({
			...membersInquiry,
			[field]: value,
		});
	};

	const changeTypeHandler = (value: string) => {
		setMembersInquiry({
			...membersInquiry,
			search: {
				...membersInquiry.search,
				memberType: value === "all" ? undefined : (value as MemberType),
			},
		});
	};

	const changeStatusHandler = (value: string) => {
		setMembersInquiry({
			...membersInquiry,
			search: {
				...membersInquiry.search,
				memberStatus: value === "all" ? undefined : (value as MemberStatus),
			},
		});
	};

	const clearAllHandler = () => {
		setMembersInquiry(initialInquiry);
	};

	return (
		<div className="flex items-center gap-6 p-6 rounded-t-lg bg-card border  ">
			{/* SEARCH */}
			<Input
				placeholder={t("search_members")}
				value={membersInquiry?.search?.text ?? ""}
				onChange={searchTextHandler}
				className="w-full bg-background text-foreground border-input focus:ring-primary"
			/>

			{/* FILTER BY TYPE */}
			<Select
				value={membersInquiry?.search?.memberType ?? "all"}
				onValueChange={(value) => {
					changeTypeHandler(value);
				}}
			>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder={t("filter_by_type")} />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground  ">
					<SelectItem value="all">{t("all_types")}</SelectItem>
					<SelectItem value={MemberType.ORGANIZER}>{t("organizer")}</SelectItem>
					<SelectItem value={MemberType.USER}>{t("user")}</SelectItem>
				</SelectContent>
			</Select>

			{/* FILTER BY STATUS */}
			<Select value={membersInquiry?.search?.memberStatus ?? "all"} onValueChange={changeStatusHandler}>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder={t("filter_by_status")} />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground  ">
					<SelectItem value="all">{t("all_statuses")}</SelectItem>
					<SelectItem value={MemberStatus.ACTIVE}>{t("active")}</SelectItem>
					<SelectItem value={MemberStatus.BLOCKED}>{t("blocked")}</SelectItem>
				</SelectContent>
			</Select>

			{/* SORT */}
			<Select
				value={membersInquiry?.sort}
				onValueChange={(value: string) => {
					inputFieldHandler("sort", value);
				}}
			>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder={t("sort_by")} />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground  ">
					<SelectItem value="createdAt">{t("created_at")}</SelectItem>
					<SelectItem value="memberPoints">{t("points")}</SelectItem>
					<SelectItem value="memberFullName">{t("full_name")}</SelectItem>
				</SelectContent>
			</Select>

			{/* Direction */}
			<Select
				value={membersInquiry?.direction}
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
