import { useRef } from "react";
import { useTranslation } from "next-i18next";
import { ChevronDown, Ticket as TicketIcon, Filter } from "lucide-react";

import { Button } from "@/libs/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/libs/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/libs/components/ui/dropdown-menu";
import { Badge } from "@/libs/components/ui/badge";
import PaginationComponent from "@/libs/components/common/PaginationComponent";
import TicketCard from "@/libs/components/events/TicketCard";

import { Tickets } from "@/libs/types/ticket/ticket";
import { TicketStatus } from "@/libs/enums/ticket.enum";
import { TicketInquiry } from "@/libs/types/ticket/ticket.input";

const LIMIT_OPTIONS = [5, 10, 20, 50];
const CATEGORY_OPTIONS = [...Object.values(TicketStatus), "ALL"];

interface MyTicketsProps {
	myTickets: Tickets;
	ticketInquiry: TicketInquiry;
	setTicketInquiry: (ticketInquiry: TicketInquiry) => void;
}

const MyTickets = ({ setTicketInquiry, ticketInquiry, myTickets }: MyTicketsProps) => {
	const { t } = useTranslation("common");
	const totalTickets = myTickets.metaCounter?.[0]?.total ?? 0;
	const ticketsListRef = useRef<HTMLDivElement>(null);

	const pageChangeHandler = (newPage: number) => {
		setTicketInquiry({ ...ticketInquiry, page: newPage });
		if (ticketsListRef.current) {
			const header = document.querySelector("header");
			const headerHeight = header ? header.offsetHeight : 80;
			const extraSpacing = 32; // 32px
			const elementPosition = ticketsListRef.current.getBoundingClientRect().top + window.pageYOffset;
			const scrollTop = Math.max(0, elementPosition - headerHeight - extraSpacing);
			window.scrollTo({ top: scrollTop, behavior: "smooth" });
		}
	};

	const limitHandler = (newLimit: number) => {
		setTicketInquiry({ ...ticketInquiry, limit: newLimit, page: 1 });
	};

	const categoryHandler = (category: string) => {
		const newCategory = category === "ALL" ? undefined : (category as TicketStatus);
		setTicketInquiry({
			...ticketInquiry,
			page: 1,
			search: {
				...ticketInquiry.search,
				ticketStatus: newCategory,
			},
		});
	};

	const currentCategory = ticketInquiry.search?.ticketStatus || "ALL";

	return (
		<Card className="mt-10 gap-0">
			<CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 pb-2">
				<CardTitle className="text-xl font-semibold text-foreground/90 w-full">{t("My Tickets")}</CardTitle>

				<div className="flex justify-between items-center w-full">
					<Badge variant="outline" className="flex items-center gap-2">
						<TicketIcon className="h-4 w-4" />
						<span className="text-sm font-medium">
							{totalTickets} {t("tickets")}
						</span>
					</Badge>

					{/* Category Filter */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-8 flex items-center gap-2">
								<Filter className="h-4 w-4" />
								{currentCategory}
								<ChevronDown className="h-4 w-4 ml-1" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{CATEGORY_OPTIONS.map((category) => (
								<DropdownMenuItem
									key={category}
									onClick={() => categoryHandler(category)}
									className={category === currentCategory ? "bg-accent" : ""}
								>
									{category}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Limit Selector */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-8 w-[70px] flex items-center justify-between">
								{ticketInquiry.limit}
								<ChevronDown className="h-4 w-4 ml-1" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{LIMIT_OPTIONS.map((option) => (
								<DropdownMenuItem
									key={option}
									onClick={() => limitHandler(option)}
									className={option === ticketInquiry.limit ? "bg-accent" : ""}
								>
									{option}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>

			<CardContent className="p-0">
				{totalTickets <= 0 ? (
					<div className="text-center py-12">
						<div className="flex flex-col items-center">
							<TicketIcon className="h-12 w-12 text-muted-foreground/50" />
							<div className="text-muted-foreground/80 text-sm">{t("You have no tickets yet")}</div>
							<div className="text-muted-foreground/60 text-xs">{t("Purchase tickets to see them here")}</div>
						</div>
					</div>
				) : (
					<div ref={ticketsListRef} className="space-y-6">
						{myTickets.list.map((ticket, index) => (
							<TicketCard key={ticket._id} ticket={ticket} showSeparator={index < myTickets.list.length - 1} />
						))}
						<div className="flex items-center justify-center mt-6">
							<PaginationComponent
								totalItems={totalTickets}
								currentPage={ticketInquiry.page}
								pageChangeHandler={pageChangeHandler}
								limit={ticketInquiry.limit}
							/>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default MyTickets;
