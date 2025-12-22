import { useTranslation } from "next-i18next";

import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/libs/components/ui/select";

import { EventCategory, EventStatus } from "@/libs/enums/event.enum";
import { EventsInquiry } from "@/libs/types/event/event.input";
import { Direction } from "@/libs/enums/common.enum";

interface EventSearchProps {
	initialInquiry: EventsInquiry;
	eventsInquiry: EventsInquiry;
	setEventsInquiry: (inquiry: EventsInquiry) => void;
}

export function EventSearch({ initialInquiry, eventsInquiry, setEventsInquiry }: EventSearchProps) {
	const { t } = useTranslation(["admin", "events"]);

	/**	 HANDLERS */
	const searchTextHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEventsInquiry({
			...eventsInquiry,
			search: {
				...eventsInquiry.search,
				text: e.target.value,
			},
		});
	};

	const inputFieldHandler = (field: string, value: number | string) => {
		setEventsInquiry({
			...eventsInquiry,
			[field]: value,
		});
	};

	const eventCategoryHandler = (value: string) => {
		setEventsInquiry({
			...eventsInquiry,
			search: {
				...eventsInquiry.search,
				eventCategories: value === "all" ? [] : [value as EventCategory],
			},
		});
	};

	const eventStatusHandler = (value: string) => {
		setEventsInquiry({
			...eventsInquiry,
			search: {
				...eventsInquiry.search,
				eventStatus: value === "all" ? undefined : (value as EventStatus),
			},
		});
	};

	const clearAllHandler = () => {
		setEventsInquiry(initialInquiry);
	};

	return (
		<div className="flex items-center gap-6 p-6 rounded-t-lg bg-card border  ">
			{/* SEARCH */}
			<Input
				placeholder={t("search_events")}
				value={eventsInquiry?.search?.text ?? ""}
				onChange={searchTextHandler}
				className="w-full bg-background text-foreground border-input focus:ring-primary"
			/>

			{/* Category */}
			<Select
				value={eventsInquiry?.search?.eventCategories?.length ? eventsInquiry?.search?.eventCategories[0] : "all"}
				onValueChange={(value) => {
					eventCategoryHandler(value);
				}}
			>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder={t("filter_by_category")} />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground  ">
					<SelectItem value="all">{t("all_categories")}</SelectItem>
					{Object.values(EventCategory).map((value) => (
						<SelectItem key={value} value={value}>
							{t(`events:${value.toLowerCase()}`)}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* Status */}
			<Select
				value={eventsInquiry?.search?.eventStatus || "all"}
				onValueChange={(value) => {
					eventStatusHandler(value);
				}}
			>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder={t("filter_by_status")} />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground  ">
					<SelectItem value="all">{t("all_statuses")}</SelectItem>
					{Object.values(EventStatus).map((value) => (
						<SelectItem key={value} value={value}>
							{t(value.charAt(0).toUpperCase() + value.slice(1))}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* SORT */}
			<Select
				value={eventsInquiry?.sort}
				onValueChange={(value: string) => {
					inputFieldHandler("sort", value);
				}}
			>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder={t("sort_by")} />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground  ">
					<SelectItem value="createdAt">{t("created_at")}</SelectItem>
					<SelectItem value="eventDate">{t("event_date")}</SelectItem>
					<SelectItem value="attendeeCount">{t("attendees")}</SelectItem>
					<SelectItem value="eventPrice">{t("price")}</SelectItem>
				</SelectContent>
			</Select>

			{/* Direction */}
			<Select
				value={eventsInquiry?.direction}
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
