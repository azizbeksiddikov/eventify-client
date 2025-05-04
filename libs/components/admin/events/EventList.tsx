import React, { useState } from 'react';
import { REACT_APP_API_URL } from '@/libs/config';
import { Event } from '@/libs/types/event/event';
import { EventStatus, EventCategory } from '@/libs/enums/event.enum';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/libs/components/ui/table';
import { Button } from '@/libs/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/libs/components/ui/avatar';
import { Input } from '@/libs/components/ui/input';
import { Edit, Save, X, Trash2 } from 'lucide-react';
import { Badge } from '@/libs/components/ui/badge';
import { format } from 'date-fns';

interface EventPanelListType {
	events: Event[];
	updateEventHandler: (data: {
		_id: string;
		eventName?: string;
		eventDesc?: string;
		eventImage?: string;
		eventDate?: Date;
		eventStartTime?: string;
		eventEndTime?: string;
		eventAddress?: string;
		eventCapacity?: number;
		eventPrice?: number;
		eventStatus?: EventStatus;
		eventCategories?: EventCategory[];
	}) => void;
	deleteEventHandler: (eventId: string) => void;
}

interface EventState {
	isEditing: boolean;
	editValues: Partial<Event>;
}

export const EventPanelList = ({ events, updateEventHandler, deleteEventHandler }: EventPanelListType) => {
	const [eventStates, setEventStates] = useState<Record<string, EventState>>({});

	const startEditing = (event: Event) => {
		setEventStates((prev) => ({
			...prev,
			[event._id]: {
				isEditing: true,
				editValues: {
					eventName: event.eventName,
					eventDesc: event.eventDesc,
					eventImage: event.eventImage,
					eventDate: event.eventDate,
					eventStartTime: event.eventStartTime,
					eventEndTime: event.eventEndTime,
					eventAddress: event.eventAddress,
					eventCapacity: event.eventCapacity,
					eventPrice: event.eventPrice,
					eventStatus: event.eventStatus,
					eventCategories: event.eventCategories,
				},
			},
		}));
	};

	const saveChanges = (eventId: string) => {
		const state = eventStates[eventId];
		if (state) {
			updateEventHandler({
				_id: eventId,
				...state.editValues,
			});
			setEventStates((prev) => ({
				...prev,
				[eventId]: {
					isEditing: false,
					editValues: {},
				},
			}));
		}
	};

	const cancelEditing = (eventId: string) => {
		setEventStates((prev) => ({
			...prev,
			[eventId]: {
				isEditing: false,
				editValues: {},
			},
		}));
	};

	const updateEditValues = (eventId: string, updates: Partial<Event>) => {
		setEventStates((prev) => ({
			...prev,
			[eventId]: {
				...prev[eventId],
				editValues: {
					...prev[eventId].editValues,
					...updates,
				},
			},
		}));
	};

	return (
		<div className="rounded-md border border-input bg-card">
			<Table>
				<TableHeader>
					<TableRow className="bg-card hover:bg-accent/50">
						<TableHead className="w-[10%] text-muted-foreground">ID</TableHead>
						<TableHead className="w-[20%] text-muted-foreground">EVENT</TableHead>
						<TableHead className="w-[15%] text-muted-foreground">DATE</TableHead>
						<TableHead className="w-[15%] text-muted-foreground">LOCATION</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">ATTENDEES</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">PRICE</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">STATUS</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">ACTIONS</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{events.length === 0 ? (
						<TableRow>
							<TableCell colSpan={8} className="text-center">
								<span className="text-muted-foreground">No data found!</span>
							</TableCell>
						</TableRow>
					) : (
						events.map((event) => {
							const state = eventStates[event._id] || { isEditing: false, editValues: {} };
							const isEditing = state.isEditing;

							return (
								<TableRow key={event._id} className="hover:bg-accent/50">
									<TableCell className="font-medium">{event._id.slice(0, 6)}...</TableCell>
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar className="h-8 w-8">
												<AvatarImage src={`${REACT_APP_API_URL}/${event.eventImage}`} alt={event.eventName} />
												<AvatarFallback>{event.eventName.slice(0, 2).toUpperCase()}</AvatarFallback>
											</Avatar>
											{isEditing ? (
												<Input
													value={state.editValues.eventName}
													onChange={(e) => updateEditValues(event._id, { eventName: e.target.value })}
													className="h-8 w-[180px] bg-background text-foreground border-input"
												/>
											) : (
												<span className="text-foreground">{event.eventName}</span>
											)}
										</div>
									</TableCell>
									<TableCell>
										{isEditing ? (
											<Input
												type="date"
												value={
													state.editValues.eventDate ? format(new Date(state.editValues.eventDate), 'yyyy-MM-dd') : ''
												}
												onChange={(e) => updateEditValues(event._id, { eventDate: new Date(e.target.value) })}
												className="h-8 w-[120px] bg-background text-foreground border-input"
											/>
										) : (
											<span className="text-foreground">{format(new Date(event.eventDate), 'MMM dd, yyyy')}</span>
										)}
									</TableCell>
									<TableCell>
										{isEditing ? (
											<Input
												value={state.editValues.eventAddress}
												onChange={(e) => updateEditValues(event._id, { eventAddress: e.target.value })}
												className="h-8 w-[180px] bg-background text-foreground border-input"
											/>
										) : (
											<span className="text-foreground">{event.eventAddress}</span>
										)}
									</TableCell>
									<TableCell>
										<Badge variant="outline" className="w-full justify-center bg-card text-foreground border-input">
											{event.attendeeCount}
										</Badge>
									</TableCell>
									<TableCell>
										{isEditing ? (
											<Input
												type="number"
												value={state.editValues.eventPrice}
												onChange={(e) => updateEditValues(event._id, { eventPrice: Number(e.target.value) })}
												className="h-8 w-[80px] bg-background text-foreground border-input"
											/>
										) : (
											<span className="text-foreground">${event.eventPrice}</span>
										)}
									</TableCell>
									<TableCell>
										<Badge
											variant="outline"
											className={`w-full justify-center ${
												event.eventStatus === EventStatus.UPCOMING
													? 'bg-success/10 text-success border-success'
													: 'bg-destructive/10 text-destructive border-destructive'
											}`}
										>
											{event.eventStatus}
										</Badge>
									</TableCell>
									<TableCell>
										<div className="flex gap-2">
											{isEditing ? (
												<>
													<Button
														variant="outline"
														size="icon"
														onClick={() => saveChanges(event._id)}
														className="text-primary hover:bg-primary hover:text-primary-foreground border-primary"
													>
														<Save className="h-4 w-4" />
													</Button>
													<Button
														variant="outline"
														size="icon"
														onClick={() => cancelEditing(event._id)}
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
														onClick={() => startEditing(event)}
														className="text-primary hover:bg-primary hover:text-primary-foreground border-primary"
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														variant="outline"
														size="icon"
														onClick={() => deleteEventHandler(event._id)}
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
						})
					)}
				</TableBody>
			</Table>
		</div>
	);
};
