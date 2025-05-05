import { useTranslation } from 'react-i18next';
import { ChevronDown, Ticket as TicketIcon, Filter } from 'lucide-react';

import { Button } from '@/libs/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/libs/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/libs/components/ui/dropdown-menu';
import { Badge } from '@/libs/components/ui/badge';
import PaginationComponent from '@/libs/components/common/PaginationComponent';
import TicketCard from '@/libs/components/events/TicketCard';

import { Tickets } from '@/libs/types/ticket/ticket';
import { TicketStatus } from '@/libs/enums/ticket.enum';
import { TicketInquiry } from '@/libs/types/ticket/ticket.input';

const LIMIT_OPTIONS = [5, 10, 20, 50];
const CATEGORY_OPTIONS = [...Object.values(TicketStatus), 'ALL'];

interface MyTicketsProps {
	myTickets: Tickets;
	ticketInquiry: TicketInquiry;
	setTicketInquiry: (ticketInquiry: TicketInquiry) => void;
}

const MyTickets = ({ setTicketInquiry, ticketInquiry, myTickets }: MyTicketsProps) => {
	const { t } = useTranslation('common');
	const totalTickets = myTickets.metaCounter?.[0]?.total ?? 0;

	const setCurrentPage = (page: number) => {
		setTicketInquiry({ ...ticketInquiry, page });
	};

	const handleLimitChange = (newLimit: number) => {
		setTicketInquiry({ ...ticketInquiry, limit: newLimit, page: 1 });
	};

	const handleCategoryChange = (category: string) => {
		const newCategory = category === 'ALL' ? undefined : (category as TicketStatus);
		setTicketInquiry({
			...ticketInquiry,
			page: 1,
			search: {
				...ticketInquiry.search,
				ticketStatus: newCategory,
			},
		});
	};

	const currentCategory = ticketInquiry.search?.ticketStatus || 'ALL';

	return (
		<Card className="mt-10">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-xl font-semibold text-foreground/90">{t('My Tickets')}</CardTitle>
				<div className="flex items-center space-x-4">
					<Badge variant="outline" className="flex items-center space-x-2">
						<TicketIcon className="h-4 w-4" />
						<span className="text-sm font-medium">
							{totalTickets} {t('tickets')}
						</span>
					</Badge>
					<div className="flex items-center space-x-2">
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
										onClick={() => handleCategoryChange(category)}
										className={category === currentCategory ? 'bg-accent' : ''}
									>
										{category}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
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
										onClick={() => handleLimitChange(option)}
										className={option === ticketInquiry.limit ? 'bg-accent' : ''}
									>
										{option}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				{totalTickets <= 0 ? (
					<div className="text-center py-12">
						<div className="flex flex-col items-center space-y-4">
							<TicketIcon className="h-12 w-12 text-muted-foreground/50" />
							<div className="text-muted-foreground/80 text-sm">{t('You have no tickets yet')}</div>
							<div className="text-muted-foreground/60 text-xs">{t('Purchase tickets to see them here')}</div>
						</div>
					</div>
				) : (
					<div className="space-y-6">
						{myTickets.list.map((ticket, index) => (
							<TicketCard key={ticket._id} ticket={ticket} showSeparator={index < myTickets.list.length - 1} />
						))}
						<div className="flex items-center justify-center mt-6">
							<PaginationComponent
								totalItems={totalTickets}
								currentPage={ticketInquiry.page}
								setCurrentPage={setCurrentPage}
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
