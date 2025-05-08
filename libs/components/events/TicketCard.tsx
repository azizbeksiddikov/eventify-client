import { useTranslation } from 'next-i18next';
import { Calendar, Ticket as TicketIcon } from 'lucide-react';

import { Badge } from '@/libs/components/ui/badge';
import { Card, CardContent } from '@/libs/components/ui/card';
import { Separator } from '@/libs/components/ui/separator';

import { formatDateHandler } from '@/libs/utils';
import { Ticket } from '@/libs/types/ticket/ticket';
import { TicketStatus } from '@/libs/enums/ticket.enum';

interface TicketCardProps {
	ticket: Ticket;
	showSeparator?: boolean;
}

const TicketCard = ({ ticket, showSeparator = true }: TicketCardProps) => {
	const { t } = useTranslation('common');

	const getStatusVariant = (status: TicketStatus) => {
		switch (status) {
			case TicketStatus.PURCHASED:
				return 'default';
			case TicketStatus.CANCELLED:
				return 'destructive';
			case TicketStatus.USED:
				return 'secondary';
			default:
				return 'secondary';
		}
	};

	return (
		<>
			<Card className="border-none shadow-none">
				<CardContent className="p-4">
					<div className="flex items-center">
						<div className="flex items-center min-w-[200px]">
							<div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
								<TicketIcon className="h-6 w-6 text-muted-foreground" />
							</div>
							<div className="flex flex-col ml-3">
								<div className="text-sm font-medium truncate max-w-[180px]">{ticket.event?.eventName || 'Event'}</div>
								<Badge variant={getStatusVariant(ticket.ticketStatus)} className="h-5 w-fit mt-1">
									{ticket.ticketStatus}
								</Badge>
								{ticket.event && (
									<div className="flex items-center mt-1">
										<Calendar className="h-3 w-3 text-muted-foreground/60" />
										<span className="text-xs text-muted-foreground/60 ml-1">
											{new Date(ticket.event.eventDate).toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric',
											})}
										</span>
									</div>
								)}
							</div>
						</div>
						<Separator orientation="vertical" className="h-12 mx-6" />
						<div className="flex-1">
							<div className="grid grid-cols-3 gap-8">
								<div className="flex flex-col">
									<span className="text-sm text-muted-foreground/60">{t('Price per ticket')}</span>
									<span className="text-base font-medium mt-1">${ticket.ticketPrice}</span>
								</div>
								<div className="flex flex-col">
									<span className="text-sm text-muted-foreground/60">{t('Quantity')}</span>
									<span className="text-base font-medium mt-1">{ticket.ticketQuantity}</span>
								</div>
								<div className="flex flex-col">
									<span className="text-sm text-muted-foreground/60">{t('Total cost')}</span>
									<span className="text-base font-medium mt-1">${ticket.totalPrice}</span>
								</div>
							</div>
						</div>
						<Separator orientation="vertical" className="h-12 mx-6" />
						<div className="min-w-[140px] text-right">
							<div className="text-xs text-muted-foreground/60">{t('Last change')}</div>
							<div className="text-sm text-muted-foreground/60 mt-1"> {formatDateHandler(ticket.createdAt)}</div>
						</div>
					</div>
				</CardContent>
			</Card>
			{showSeparator && <Separator className="my-4" />}
		</>
	);
};

export default TicketCard;
