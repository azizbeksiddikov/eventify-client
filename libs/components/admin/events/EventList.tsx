import { useTranslation } from "next-i18next";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/libs/components/ui/table";
import EventRow from "@/libs/components/admin/events/EventRow";

import { Events, Event } from "@/libs/types/event/event";
import { EventUpdateInput } from "@/libs/types/event/event.update";

interface EventPanelListType {
	events: Events;
	updateEventHandler: (event: EventUpdateInput) => Promise<void>;
	removeEventHandler: (eventId: string) => Promise<void>;
}

export const EventPanelList = ({ events, updateEventHandler, removeEventHandler }: EventPanelListType) => {
	const { t } = useTranslation("admin");

	return (
		<div className="rounded-md border border-input bg-card">
			<Table className="table-fixed">
				<TableHeader>
					<TableRow className="bg-card hover:bg-accent/50">
						<TableHead className="w-[8%] text-muted-foreground">{t("id")}</TableHead>
						<TableHead className="w-[18%] text-muted-foreground">{t("event")}</TableHead>
						<TableHead className="w-[12%] text-muted-foreground">{t("start_date")}</TableHead>
						<TableHead className="w-[12%] text-muted-foreground">{t("end_date")}</TableHead>
						<TableHead className="w-[15%] text-muted-foreground">{t("location")}</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">{t("attendees")}</TableHead>
						<TableHead className="w-[8%] text-muted-foreground">{t("price")}</TableHead>
						<TableHead className="w-[8%] text-muted-foreground">{t("status")}</TableHead>
						<TableHead className="w-[7%] text-muted-foreground">{t("actions")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{events.metaCounter[0]?.total === 0 ? (
						<TableRow>
							<TableCell colSpan={8} className="text-center">
								<span className="text-muted-foreground">{t("no_data_found")}</span>
							</TableCell>
						</TableRow>
					) : (
						events.list.map((event: Event) => {
							return (
								<EventRow
									key={event._id}
									event={event}
									updateEventHandler={updateEventHandler}
									removeEventHandler={removeEventHandler}
								/>
							);
						})
					)}
				</TableBody>
			</Table>
		</div>
	);
};
