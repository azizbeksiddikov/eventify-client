import { useState } from 'react';
import { useRouter } from 'next/router';
import { EventInput, EventCategory } from '@/libs/types/event/event.input';
import { Button } from '@/libs/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { Input } from '@/libs/components/ui/input';
import { Label } from '@/libs/components/ui/label';
import { Textarea } from '@/libs/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';
import { Calendar } from '@/libs/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/libs/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

const CreateEventPage = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [formData, setFormData] = useState<Partial<EventInput>>({
		eventName: '',
		eventDescription: '',
		eventCategory: EventCategory.TECHNOLOGY,
		eventLocation: '',
		eventStartDate: new Date(),
		eventEndDate: new Date(),
		eventPrice: 0,
		eventCapacity: 100,
		eventImage: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			// TODO: Replace with actual API call
			console.log('Creating event with:', formData);
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			router.push('/organizer/events'); // Redirect to events list
		} catch (error) {
			console.error('Failed to create event:', error);
			setError('Failed to create event');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background py-12">
			<div className="max-w-3xl mx-auto px-4">
				<Card className="bg-card">
					<CardHeader>
						<CardTitle className="text-card-foreground text-2xl font-semibold">Create New Event</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-4">
								{/* Event Name */}
								<div>
									<Label htmlFor="eventName" className="text-card-foreground">
										Event Name
									</Label>
									<Input
										id="eventName"
										name="eventName"
										value={formData.eventName}
										onChange={handleChange}
										required
										className="bg-background text-foreground border-input"
									/>
								</div>

								{/* Event Description */}
								<div>
									<Label htmlFor="eventDescription" className="text-card-foreground">
										Description
									</Label>
									<Textarea
										id="eventDescription"
										name="eventDescription"
										value={formData.eventDescription}
										onChange={handleChange}
										required
										className="bg-background text-foreground border-input min-h-[100px]"
									/>
								</div>

								{/* Event Category */}
								<div>
									<Label htmlFor="eventCategory" className="text-card-foreground">
										Category
									</Label>
									<Select
										value={formData.eventCategory}
										onValueChange={(value) =>
											setFormData((prev) => ({ ...prev, eventCategory: value as EventCategory }))
										}
									>
										<SelectTrigger className="bg-background text-foreground border-input">
											<SelectValue placeholder="Select category" />
										</SelectTrigger>
										<SelectContent>
											{Object.values(EventCategory).map((category) => (
												<SelectItem key={category} value={category}>
													{category}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{/* Event Location */}
								<div>
									<Label htmlFor="eventLocation" className="text-card-foreground">
										Location
									</Label>
									<Input
										id="eventLocation"
										name="eventLocation"
										value={formData.eventLocation}
										onChange={handleChange}
										required
										className="bg-background text-foreground border-input"
									/>
								</div>

								{/* Event Dates */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label className="text-card-foreground">Start Date</Label>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className="w-full justify-start text-left font-normal bg-background text-foreground border-input"
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{formData.eventStartDate ? format(formData.eventStartDate, 'PPP') : <span>Pick a date</span>}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													selected={formData.eventStartDate}
													onSelect={(date) => setFormData((prev) => ({ ...prev, eventStartDate: date }))}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									</div>
									<div>
										<Label className="text-card-foreground">End Date</Label>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className="w-full justify-start text-left font-normal bg-background text-foreground border-input"
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{formData.eventEndDate ? format(formData.eventEndDate, 'PPP') : <span>Pick a date</span>}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													selected={formData.eventEndDate}
													onSelect={(date) => setFormData((prev) => ({ ...prev, eventEndDate: date }))}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									</div>
								</div>

								{/* Event Price and Capacity */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="eventPrice" className="text-card-foreground">
											Price ($)
										</Label>
										<Input
											id="eventPrice"
											name="eventPrice"
											type="number"
											value={formData.eventPrice}
											onChange={handleChange}
											required
											min="0"
											className="bg-background text-foreground border-input"
										/>
									</div>
									<div>
										<Label htmlFor="eventCapacity" className="text-card-foreground">
											Capacity
										</Label>
										<Input
											id="eventCapacity"
											name="eventCapacity"
											type="number"
											value={formData.eventCapacity}
											onChange={handleChange}
											required
											min="1"
											className="bg-background text-foreground border-input"
										/>
									</div>
								</div>

								{/* Event Image URL */}
								<div>
									<Label htmlFor="eventImage" className="text-card-foreground">
										Image URL
									</Label>
									<Input
										id="eventImage"
										name="eventImage"
										value={formData.eventImage}
										onChange={handleChange}
										className="bg-background text-foreground border-input"
									/>
								</div>
							</div>

							{error && <div className="text-destructive text-sm">{error}</div>}

							<div className="flex justify-end gap-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => router.back()}
									className="text-card-foreground border-input hover:bg-accent hover:text-accent-foreground"
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={isLoading}
									className="bg-primary text-primary-foreground hover:bg-primary/90"
								>
									{isLoading ? 'Creating...' : 'Create Event'}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default CreateEventPage;
