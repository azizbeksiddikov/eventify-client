import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { Calendar, Edit, Save, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { AvatarImage } from '@/libs/components/ui/avatar';
import { Badge } from '@/libs/components/ui/badge';
import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { TableCell, TableRow } from '@/libs/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/libs/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/libs/components/ui/calendar';

import { REACT_APP_API_URL } from '@/libs/config';
import { Event } from '@/libs/types/event/event';
import { EventUpdateInput } from '@/libs/types/event/event.update';
import { EventStatus } from '@/libs/enums/event.enum';

// Define status color mapping based on global CSS variables
const STATUS_COLORS = {
	[EventStatus.UPCOMING]: {
		bg: 'bg-success/10',
		text: 'text-success',
		border: 'border-success',
	},
	[EventStatus.ONGOING]: {
		bg: 'bg-primary/10',
		text: 'text-primary',
		border: 'border-primary',
	},
	[EventStatus.COMPLETED]: {
		bg: 'bg-accent/10',
		text: 'text-accent-foreground',
		border: 'border-accent',
	},
	[EventStatus.CANCELLED]: {
		bg: 'bg-destructive/10',
		text: 'text-destructive',
		border: 'border-destructive',
	},
	[EventStatus.DELETED]: {
		bg: 'bg-muted/50',
		text: 'text-muted-foreground',
		border: 'border-muted',
	},
};

interface EventRowProps {
	event: Event;
	updateEventHandler: (event: EventUpdateInput) => Promise<void>;
	removeEventHandler: (eventId: string) => Promise<void>;
	initialEvent?: EventUpdateInput;
}

const EventRow = ({
	event,
	updateEventHandler,
	removeEventHandler,
	initialEvent = {
		_id: event._id,
		eventName: event.eventName,
		eventCity: event.eventCity,
		eventAddress: event.eventAddress,
		eventCapacity: event.eventCapacity,
		eventPrice: event.eventPrice,
		eventStatus: event.eventStatus,
		eventDate: event.eventDate,
	},
}: EventRowProps) => {
	const [eventUpdateInput, setEventUpdateInput] = useState<EventUpdateInput>(initialEvent);
	const [isEditing, setIsEditing] = useState(false);

	const cancelHandler = () => {
		setEventUpdateInput(initialEvent);
		setIsEditing(false);
	};

	const saveHandler = async () => {
		await updateEventHandler(eventUpdateInput);
		setIsEditing(false);
	};

	const removeHandler = async () => {
		await removeEventHandler(event._id);
	};

	const inputHandler = (field: keyof EventUpdateInput, value: string | number | Date) => {
		setEventUpdateInput((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	return (
		<TableRow key={event._id} className="hover:bg-accent/50">
			{/* ID */}
			<TableCell className="font-medium text-foreground">{event._id}</TableCell>

			{/* EVENT IMAGE + NAME */}
			<TableCell>
				<div className="flex items-center gap-2">
					<Avatar className="h-8 w-8 border border-input flex items-center justify-center ">
						<AvatarImage src={`${REACT_APP_API_URL}/${event.eventImage}`} alt={event.eventName} />
						<AvatarFallback className="bg-muted text-muted-foreground flex items-center justify-center">
							<Calendar className="h-4 w-4" />
						</AvatarFallback>
					</Avatar>
					{isEditing ? (
						<Input
							value={eventUpdateInput.eventName ?? event.eventName ?? ''}
							onChange={(e) => inputHandler('eventName', e.target.value)}
							className="w-full bg-background text-foreground border-input focus:ring-primary"
						/>
					) : (
						<Link
							href={`/event/detail?eventId=${event._id}`}
							className="font-medium text-foreground underline hover:text-primary hover:underline"
						>
							{event.eventName}
						</Link>
					)}
				</div>
			</TableCell>

			{/* EVENT DATE */}
			<TableCell>
				{isEditing ? (
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className="w-full justify-start text-left font-normal bg-background text-foreground border-input"
							>
								<Calendar className="mr-2 h-4 w-4" />
								{eventUpdateInput.eventDate
									? format(new Date(eventUpdateInput.eventDate), 'PPP')
									: format(new Date(event.eventDate), 'PPP')}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<CalendarComponent
								mode="single"
								selected={new Date(eventUpdateInput.eventDate || event.eventDate)}
								onSelect={(date) => date && inputHandler('eventDate', date)}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
				) : (
					<span className="text-foreground">
						{new Date(event.eventDate).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</span>
				)}
			</TableCell>

			{/* EVENT ADDRESS */}
			<TableCell>
				{isEditing ? (
					<Input
						value={eventUpdateInput.eventAddress ?? event.eventAddress ?? ''}
						onChange={(e) => inputHandler('eventAddress', e.target.value)}
						className="h-8 w-[180px] bg-background text-foreground border-input"
					/>
				) : (
					<span className="text-foreground">{event.eventAddress}</span>
				)}
			</TableCell>

			{/* EVENT ATTENDEE COUNT */}
			<TableCell>
				<Badge variant="outline" className="w-full justify-center bg-card text-foreground border-input">
					{event.attendeeCount} / {event.eventCapacity}
				</Badge>
			</TableCell>

			{/* EVENT PRICE */}
			<TableCell>
				{isEditing ? (
					<Input
						type="number"
						value={eventUpdateInput.eventPrice ?? event.eventPrice ?? ''}
						onChange={(e) => inputHandler('eventPrice', Number(e.target.value))}
						className="h-8 w-[80px] bg-background text-foreground border-input"
					/>
				) : (
					<span className="text-foreground">${event.eventPrice}</span>
				)}
			</TableCell>

			{/* EVENT STATUS */}
			<TableCell>
				{isEditing ? (
					<Select
						value={eventUpdateInput.eventStatus || event.eventStatus}
						onValueChange={(value) => inputHandler('eventStatus', value as EventStatus)}
					>
						<SelectTrigger className="h-8 w-full bg-background text-foreground border-input">
							<SelectValue placeholder={event.eventStatus} />
						</SelectTrigger>
						<SelectContent>
							{Object.values(EventStatus).map((status) => (
								<SelectItem key={status} value={status}>
									{status[0].toUpperCase() + status.slice(1).toLowerCase()}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				) : (
					<Badge
						variant="outline"
						className={`w-full justify-center ${STATUS_COLORS[event.eventStatus]?.bg || 'bg-secondary/10'} ${
							STATUS_COLORS[event.eventStatus]?.text || 'text-secondary'
						} ${STATUS_COLORS[event.eventStatus]?.border || 'border-secondary'}`}
					>
						{event.eventStatus}
					</Badge>
				)}
			</TableCell>

			{/* EVENT ACTIONS */}
			<TableCell>
				<div className="flex gap-2">
					{isEditing ? (
						<>
							<Button
								variant="outline"
								size="icon"
								onClick={() => saveHandler()}
								className="text-primary hover:bg-primary hover:text-primary-foreground border-primary"
							>
								<Save className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => cancelHandler()}
								className="text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive"
							>
								<X className="h-4 w-4" />
							</Button>
						</>
					) : (
						<>
							<Button
								variant="outline"
								size="icon"
								onClick={() => setIsEditing(true)}
								className="text-primary hover:bg-primary hover:text-primary-foreground border-primary"
							>
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => removeHandler()}
								className="text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</>
					)}
				</div>
			</TableCell>
		</TableRow>
	);
};

export default EventRow;
