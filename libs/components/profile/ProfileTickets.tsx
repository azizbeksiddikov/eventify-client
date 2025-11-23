import Link from "next/link";
import { useTranslation } from "next-i18next";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Users, DollarSign, Clock, Link as LinkIcon, Ticket as TicketIcon } from "lucide-react";

import { Badge } from "@/libs/components/ui/badge";
import { Button } from "@/libs/components/ui/button";
import { Card, CardContent, CardHeader } from "@/libs/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/libs/components/ui/table";

import { TicketStatus } from "@/libs/enums/ticket.enum";
import { Ticket } from "@/libs/types/ticket/ticket";

interface ProfileTicketsProps {
	tickets: Ticket[];
	cancelTicketHandler: (ticketId: string) => void;
}

export const ProfileTickets = ({ tickets, cancelTicketHandler }: ProfileTicketsProps) => {
	const { t } = useTranslation("common");

	const getStatusColor = (status: TicketStatus) => {
		switch (status) {
			case TicketStatus.PURCHASED:
				return "bg-green-100 text-green-800";
			case TicketStatus.CANCELLED:
				return "bg-red-100 text-red-800";
			case TicketStatus.USED:
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<h2 className="text-lg font-medium text-card-foreground">{t("My Tickets")}</h2>
			</CardHeader>
			<CardContent>
				{tickets.length === 0 ? (
					<div className="text-center text-muted-foreground py-8">{t("No tickets found")}</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[250px] px-4">{t("Event")}</TableHead>
								<TableHead className="text-center px-2">{t("Status")}</TableHead>
								<TableHead className="text-center px-2">{t("Attendees")}</TableHead>
								<TableHead className="text-center px-2">{t("Tickets")}</TableHead>
								<TableHead className="text-center px-2">{t("Price")}</TableHead>
								<TableHead className="text-center px-2">{t("Total")}</TableHead>
								<TableHead className="text-center px-2">{t("Date")}</TableHead>
								<TableHead className="text-right px-4">{t("Actions")}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tickets.map((ticket) => {
								const eventDate = ticket.event?.eventStartAt ? new Date(ticket.event.eventStartAt) : null;
								const formattedDate = eventDate ? formatDistanceToNow(eventDate, { addSuffix: true }) : "";
								const totalPrice = ticket.ticketPrice * (ticket.ticketQuantity || 1);

								return (
									<TableRow key={ticket._id} className="hover:bg-muted/50">
										<TableCell className="px-4">
											<div className="flex items-center gap-3">
												<div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
													<Calendar className="h-5 w-5 text-muted-foreground" />
												</div>
												<div>
													<h3 className="text-sm font-medium text-card-foreground">
														{ticket.event?.eventName || t("Event")}
													</h3>
												</div>
											</div>
										</TableCell>
										<TableCell className="text-center px-2">
											<Badge variant="outline" className={getStatusColor(ticket.ticketStatus)}>
												{ticket.ticketStatus}
											</Badge>
										</TableCell>
										<TableCell className="text-center px-2">
											<div className="flex items-center justify-center gap-2">
												<Users className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm text-muted-foreground">{ticket.event?.attendeeCount ?? 0}</span>
											</div>
										</TableCell>
										<TableCell className="text-center px-2">
											<div className="flex items-center justify-center gap-2">
												<TicketIcon className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm text-muted-foreground">{ticket.ticketQuantity || 1}</span>
											</div>
										</TableCell>
										<TableCell className="text-center px-2">
											<div className="flex items-center justify-center gap-2">
												<DollarSign className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm text-muted-foreground">{ticket.ticketPrice}</span>
											</div>
										</TableCell>
										<TableCell className="text-center px-2">
											<div className="flex items-center justify-center gap-2">
												<DollarSign className="h-4 w-4 text-primary" />
												<span className="text-sm font-medium text-primary">{totalPrice}</span>
											</div>
										</TableCell>
										<TableCell className="text-center px-2">
											<div className="flex items-center justify-center gap-2">
												<Clock className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm text-muted-foreground">{formattedDate}</span>
											</div>
										</TableCell>
										<TableCell className="text-right px-4">
											<div className="flex items-center justify-end gap-2">
												{ticket.ticketStatus === TicketStatus.PURCHASED && (
													<Button
														variant="outline"
														size="sm"
														onClick={() => cancelTicketHandler(ticket._id)}
														className="bg-destructive/10 border-destructive text-destructive hover:bg-destructive/20 hover:text-destructive transition-colors duration-200"
													>
														{t("Cancel")}
													</Button>
												)}
												<Link href={`/events/${ticket.event?._id}`}>
													<Button
														variant="ghost"
														size="icon"
														className="text-muted-foreground hover:text-primary transition-colors duration-200"
														aria-label={t("View event details")}
													>
														<LinkIcon className="h-4 w-4" />
													</Button>
												</Link>
											</div>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
};
