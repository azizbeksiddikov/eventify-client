import { useTranslation } from "next-i18next";
import { Ticket as TicketIcon } from "lucide-react";

import { Badge } from "@/libs/components/ui/badge";
import { Card, CardContent } from "@/libs/components/ui/card";
import { Separator } from "@/libs/components/ui/separator";

import { formatSeoulDateTime } from "@/libs/utils";
import { Ticket } from "@/libs/types/ticket/ticket";
import { TicketStatus } from "@/libs/enums/ticket.enum";

interface TicketCardProps {
	ticket: Ticket;
	showSeparator?: boolean;
}

const TicketCard = ({ ticket, showSeparator = true }: TicketCardProps) => {
	const { t } = useTranslation("events");

	const getStatusVariant = (status: TicketStatus) => {
		switch (status) {
			case TicketStatus.PURCHASED:
				return "default";
			case TicketStatus.CANCELLED:
				return "destructive";
			case TicketStatus.USED:
				return "secondary";
			default:
				return "secondary";
		}
	};

	return (
		<>
			<Card className="border-none shadow-none gap-0 my-0 py-0">
				<CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
					{/* Event Info */}
					<div className="flex items-start sm:items-center sm:min-w-40">
						<div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
							<TicketIcon className="h-6 w-6 text-muted-foreground" />
						</div>
						<div className="flex flex-col ml-3">
							<div className="text-sm font-medium truncate max-w-[180px]">{ticket.event?.eventName || "Event"}</div>
							<Badge variant={getStatusVariant(ticket.ticketStatus)} className="h-5 w-fit mt-1">
								{ticket.ticketStatus}
							</Badge>
						</div>
					</div>

					{/* Ticket Info */}
					<div className="flex-1 py-0">
						<div className="grid grid-cols-3 gap-4 text-center sm:text-left">
							{/* Price */}
							<div className="flex flex-col">
								<span className="inline text-sm text-muted-foreground/60">{t("price_per_ticket")}</span>
								<span className="text-base font-medium mt-0 sm:mt-1">${ticket.ticketPrice}</span>
							</div>
							{/* Quantity */}
							<div className="flex flex-col">
								<span className="inline text-sm text-muted-foreground/60">{t("quantity")}</span>
								<span className="text-base font-medium mt-0 sm:mt-1">{ticket.ticketQuantity}</span>
							</div>
							{/* Total */}
							<div className="flex flex-col">
								<span className="inline text-sm text-muted-foreground/60">{t("total_cost")}</span>
								<span className="text-base font-medium mt-0 sm:mt-1">${ticket.totalPrice}</span>
							</div>
						</div>
					</div>

					{/* Timestamp - hidden on small screens */}
					<div className="hidden lg:block min-w-40 text-right">
						<div className="text-xs text-muted-foreground/60">{t("last_change")}</div>
						<div className="text-sm text-muted-foreground/60 mt-1">{formatSeoulDateTime(ticket.createdAt)}</div>
					</div>
				</CardContent>
			</Card>
			{showSeparator && <Separator className="my-4" />}
		</>
	);
};

export default TicketCard;
