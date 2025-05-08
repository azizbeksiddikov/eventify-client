import React from 'react';
import { useTranslation } from 'next-i18next';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/libs/components/ui/table';

import { Events, Event } from '@/libs/types/event/event';
import { EventUpdateInput } from '@/libs/types/event/event.update';
import EventRow from './EventRow';

interface EventPanelListType {
	events: Events;
	updateEventHandler: (event: EventUpdateInput) => Promise<void>;
	removeEventHandler: (eventId: string) => Promise<void>;
}

export const EventPanelList = ({ events, updateEventHandler, removeEventHandler }: EventPanelListType) => {
	const { t } = useTranslation();

	return (
		<div className="rounded-md border border-input bg-card">
			<Table>
				<TableHeader>
					<TableRow className="bg-card hover:bg-accent/50">
						<TableHead className="w-[10%] text-muted-foreground">{t('ID')}</TableHead>
						<TableHead className="w-[20%] text-muted-foreground">{t('EVENT')}</TableHead>
						<TableHead className="w-[15%] text-muted-foreground">{t('DATE')}</TableHead>
						<TableHead className="w-[15%] text-muted-foreground">{t('LOCATION')}</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">{t('ATTENDEES')}</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">{t('PRICE')}</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">{t('STATUS')}</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">{t('ACTIONS')}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{events.metaCounter[0]?.total === 0 ? (
						<TableRow>
							<TableCell colSpan={8} className="text-center">
								<span className="text-muted-foreground">{t('No data found!')}</span>
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
