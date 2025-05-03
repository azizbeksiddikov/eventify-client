import { useState } from 'react';
import { useRouter } from 'next/router';
import { EventCategory, EventStatus } from '@/libs/enums/event.enum';
import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Textarea } from '@/libs/components/ui/textarea';
import { Card } from '@/libs/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';
import { ImageIcon, RefreshCw, CalendarIcon } from 'lucide-react';
import { Calendar } from '@/libs/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/libs/components/ui/popover';
import { ScrollArea } from '@/libs/components/ui/scroll-area';
import { cn } from '@/libs/utils';
import { format } from 'date-fns';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { EventInput } from '@/libs/types/event/event.input';
import { Group } from '@/libs/types/group/group';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// Mock data for user's groups
import { groupList as userGroups } from '@/data';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const EventCreatePage = () => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
	const [timeError, setTimeError] = useState<string | null>(null);

	const [formData, setFormData] = useState<EventInput>({
		eventName: '',
		eventDesc: '',
		eventImage: '',
		eventDate: new Date(),
		eventStartTime: '00:00',
		eventEndTime: '00:15',
		eventAddress: '',
		eventCity: '',
		eventCapacity: 0,
		eventPrice: 0,
		eventStatus: EventStatus.UPCOMING,
		eventCategories: [],
		groupId: '',
	});

	const validateTime = (startTime: string, endTime: string) => {
		const [startHour, startMinute] = startTime.split(':').map(Number);
		const [endHour, endMinute] = endTime.split(':').map(Number);

		if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
			setTimeError('End time must be later than start time');
			return false;
		}
		setTimeError(null);
		return true;
	};

	const handleStartTimeChange = (hour: string, minute: string) => {
		const newStartTime = `${hour}:${minute}`;
		setFormData((prev) => {
			const newData = { ...prev, eventStartTime: newStartTime };
			validateTime(newStartTime, newData.eventEndTime);
			return newData;
		});
	};

	const handleEndTimeChange = (hour: string, minute: string) => {
		const newEndTime = `${hour}:${minute}`;
		setFormData((prev) => {
			const newData = { ...prev, eventEndTime: newEndTime };
			validateTime(newData.eventStartTime, newEndTime);
			return newData;
		});
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const result = reader.result as string;
				setImagePreview(result);
				setFormData((prev) => ({ ...prev, eventImage: result }));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			// Update formData with selected categories before submission
			const updatedFormData = {
				...formData,
				eventCategories: selectedCategories,
			};
			console.log('Creating event:', updatedFormData);
			router.push('/events');
		} catch (error) {
			console.error('Error creating event:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleCategorySelect = (category: EventCategory) => {
		if (selectedCategories.includes(category)) {
			// If category is already selected, remove it
			setSelectedCategories((prev) => prev.filter((c) => c !== category));
		} else if (selectedCategories.length < 3) {
			// If category is not selected and we haven't reached the limit, add it
			setSelectedCategories((prev) => [...prev, category]);
		}
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<Button
						variant="outline"
						onClick={() => router.push('/events')}
						className="flex items-center gap-2 text-primary hover:text-primary-foreground hover:bg-primary border-primary hover:border-primary/80 transition-colors duration-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-4 w-4"
						>
							<path d="m15 18-6-6 6-6" />
						</svg>
						Back to Events
					</Button>
				</div>

				<Card className="p-6 bg-card text-card-foreground">
					<h1 className="text-3xl font-semibold text-foreground mb-6">Create New Event</h1>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Group Selection */}
						<div className="space-y-2">
							<label htmlFor="groupId" className="text-sm font-medium text-foreground">
								Select Group
							</label>
							<Select
								value={formData.groupId}
								onValueChange={(value: string) => setFormData((prev) => ({ ...prev, groupId: value }))}
							>
								<SelectTrigger className="w-full bg-input text-input-foreground border-input">
									<SelectValue placeholder="Select a group">
										{formData.groupId && (
											<div className="flex items-center space-x-3">
												<div className="relative h-8 w-8 rounded-full overflow-hidden">
													<img
														src={userGroups.find((group) => group._id === formData.groupId)?.groupImage}
														alt="Group preview"
														className="object-cover w-full h-full"
													/>
												</div>
												<span className="text-foreground">
													{userGroups.find((g) => g._id === formData.groupId)?.groupName}
												</span>
											</div>
										)}
									</SelectValue>
								</SelectTrigger>
								<SelectContent className="bg-popover text-popover-foreground border-border">
									{userGroups.map((group: Group) => (
										<SelectItem
											key={group._id}
											value={group._id}
											className="py-3 hover:bg-accent hover:text-accent-foreground"
										>
											<div className="flex items-center space-x-4">
												<div className="relative h-10 w-10 rounded-full overflow-hidden">
													<img src={group.groupImage} alt={group.groupName} className="object-cover w-full h-full" />
												</div>
												<div>
													<div className="font-medium text-foreground">{group.groupName}</div>
													<div className="text-xs text-muted-foreground">{group.memberCount} members</div>
												</div>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Event Name */}
						<div className="space-y-2">
							<label htmlFor="eventName" className="text-sm font-medium text-foreground">
								Event Name
							</label>
							<Input
								id="eventName"
								name="eventName"
								value={formData.eventName}
								onChange={handleInputChange}
								placeholder="Enter event name"
								className="bg-input text-input-foreground border-input"
								required
							/>
						</div>

						{/* Event Description */}
						<div className="space-y-2">
							<label htmlFor="eventDesc" className="text-sm font-medium text-foreground">
								Description
							</label>
							<Textarea
								id="eventDesc"
								name="eventDesc"
								value={formData.eventDesc}
								onChange={handleInputChange}
								placeholder="Describe your event"
								className="min-h-[120px] bg-input text-input-foreground border-input"
								required
							/>
						</div>

						{/* Categories */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground">Categories (Select up to 3)</label>
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
								{Object.values(EventCategory).map((category) => (
									<Button
										key={category}
										type="button"
										variant={selectedCategories.includes(category) ? 'default' : 'outline'}
										onClick={() => handleCategorySelect(category)}
										disabled={selectedCategories.length >= 3 && !selectedCategories.includes(category)}
										className={`h-10 transition-all duration-200 ${
											selectedCategories.includes(category)
												? 'bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90'
												: 'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground'
										} disabled:opacity-50 disabled:cursor-not-allowed`}
									>
										{category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' ')}
									</Button>
								))}
							</div>
						</div>

						{/* Event Date and Time */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div className="space-y-2">
								<label htmlFor="eventDate" className="text-sm font-medium text-foreground">
									Event Date
								</label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={cn(
												'w-full justify-start text-left font-normal bg-input text-input-foreground border-input hover:bg-accent hover:text-accent-foreground transition-colors duration-200',
												!formData.eventDate && 'text-muted-foreground',
											)}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{formData.eventDate ? format(formData.eventDate, 'PPP') : <span>Pick a date</span>}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0 bg-popover text-popover-foreground border-border">
										<Calendar
											mode="single"
											selected={formData.eventDate}
											onSelect={(date) => date && setFormData((prev) => ({ ...prev, eventDate: date }))}
											initialFocus
											disabled={(date) => date < new Date()}
											className="rounded-md border"
										/>
									</PopoverContent>
								</Popover>
							</div>
							<div className="space-y-2">
								<label htmlFor="eventStartTime" className="text-sm font-medium text-foreground">
									Start Time
								</label>
								<div className="flex gap-2">
									<Select
										value={formData.eventStartTime.split(':')[0]}
										onValueChange={(hour) => {
											const currentTime = formData.eventStartTime.split(':');
											handleStartTimeChange(hour, currentTime[1]);
										}}
									>
										<SelectTrigger className="w-20 bg-input text-input-foreground border-input hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
											<SelectValue placeholder="HH" />
										</SelectTrigger>
										<SelectContent className="bg-popover text-popover-foreground border-border">
											<ScrollArea className="h-[200px]">
												{[...Array(24)].map((_, i) => (
													<SelectItem
														key={i}
														value={i.toString().padStart(2, '0')}
														className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
													>
														{i.toString().padStart(2, '0')}
													</SelectItem>
												))}
											</ScrollArea>
										</SelectContent>
									</Select>
									<Select
										value={formData.eventStartTime.split(':')[1]}
										onValueChange={(minute) => {
											const currentTime = formData.eventStartTime.split(':');
											handleStartTimeChange(currentTime[0], minute);
										}}
									>
										<SelectTrigger className="w-20 bg-input text-input-foreground border-input hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
											<SelectValue placeholder="MM" />
										</SelectTrigger>
										<SelectContent className="bg-popover text-popover-foreground border-border">
											<ScrollArea className="h-[200px]">
												{[...Array(12)].map((_, i) => {
													const minute = (i * 5).toString().padStart(2, '0');
													return (
														<SelectItem
															key={minute}
															value={minute}
															className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
														>
															{minute}
														</SelectItem>
													);
												})}
											</ScrollArea>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="space-y-2">
								<label htmlFor="eventEndTime" className="text-sm font-medium text-foreground">
									End Time
								</label>
								<div className="flex gap-2">
									<Select
										value={formData.eventEndTime.split(':')[0]}
										onValueChange={(hour) => {
											const currentTime = formData.eventEndTime.split(':');
											handleEndTimeChange(hour, currentTime[1]);
										}}
									>
										<SelectTrigger className="w-20 bg-input text-input-foreground border-input hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
											<SelectValue placeholder="HH" />
										</SelectTrigger>
										<SelectContent className="bg-popover text-popover-foreground border-border">
											<ScrollArea className="h-[200px]">
												{[...Array(24)].map((_, i) => (
													<SelectItem
														key={i}
														value={i.toString().padStart(2, '0')}
														className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
													>
														{i.toString().padStart(2, '0')}
													</SelectItem>
												))}
											</ScrollArea>
										</SelectContent>
									</Select>
									<Select
										value={formData.eventEndTime.split(':')[1]}
										onValueChange={(minute) => {
											const currentTime = formData.eventEndTime.split(':');
											handleEndTimeChange(currentTime[0], minute);
										}}
									>
										<SelectTrigger className="w-20 bg-input text-input-foreground border-input hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
											<SelectValue placeholder="MM" />
										</SelectTrigger>
										<SelectContent className="bg-popover text-popover-foreground border-border">
											<ScrollArea className="h-[200px]">
												{[...Array(12)].map((_, i) => {
													const minute = (i * 5).toString().padStart(2, '0');
													return (
														<SelectItem
															key={minute}
															value={minute}
															className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
														>
															{minute}
														</SelectItem>
													);
												})}
											</ScrollArea>
										</SelectContent>
									</Select>
								</div>
								{timeError && <p className="text-sm text-destructive mt-1">{timeError}</p>}
							</div>
						</div>

						{/* Location */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor="eventCity" className="text-sm font-medium text-foreground">
									City
								</label>
								<Input
									id="eventCity"
									name="eventCity"
									value={formData.eventCity}
									onChange={handleInputChange}
									placeholder="Enter city"
									className="bg-input text-input-foreground border-input"
									required
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="eventAddress" className="text-sm font-medium text-foreground">
									Address
								</label>
								<Input
									id="eventAddress"
									name="eventAddress"
									value={formData.eventAddress}
									onChange={handleInputChange}
									placeholder="Enter address"
									className="bg-input text-input-foreground border-input"
									required
								/>
							</div>
						</div>

						{/* Capacity and Price */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor="eventCapacity" className="text-sm font-medium text-foreground">
									Capacity
								</label>
								<Input
									id="eventCapacity"
									name="eventCapacity"
									type="number"
									min="1"
									value={formData.eventCapacity}
									onChange={handleInputChange}
									placeholder="Enter event capacity"
									className="bg-input text-input-foreground border-input"
									required
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="eventPrice" className="text-sm font-medium text-foreground">
									Price
								</label>
								<Input
									id="eventPrice"
									name="eventPrice"
									type="number"
									min="0"
									step="0.01"
									value={formData.eventPrice}
									onChange={handleInputChange}
									placeholder="Enter event price"
									className="bg-input text-input-foreground border-input"
									required
								/>
							</div>
						</div>

						{/* Image Section */}
						<div className="space-y-4">
							<label className="text-sm font-medium text-foreground">Event Image</label>
							<div className="relative aspect-video w-full max-w-2xl mx-auto rounded-xl overflow-hidden bg-muted/50">
								{imagePreview ? (
									<>
										<img src={imagePreview} alt="Event preview" className="object-contain w-full h-full" />
										<label
											htmlFor="image"
											className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors duration-200 cursor-pointer"
										>
											<div className="flex items-center gap-2 bg-white/90 text-foreground px-4 py-2 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200">
												<RefreshCw className="h-4 w-4" />
												<span className="font-medium">Reset Image</span>
											</div>
										</label>
									</>
								) : (
									<label
										htmlFor="image"
										className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 hover:bg-muted/60 transition-colors duration-200 cursor-pointer"
									>
										<ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
										<span className="text-muted-foreground font-medium">Click to upload image</span>
									</label>
								)}
								<input
									id="image"
									name="image"
									type="file"
									accept=".jpg,.jpeg,.png,image/jpeg,image/png"
									onChange={handleImageChange}
									className="hidden"
									required
								/>
								<p className="text-sm text-muted-foreground mt-1">Only JPG, JPEG, and PNG files are allowed</p>
							</div>
						</div>

						{/* Submit Button */}
						<div className="flex justify-end">
							<Button
								type="submit"
								size="lg"
								disabled={isSubmitting || selectedCategories.length === 0}
								className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-8"
							>
								{isSubmitting ? 'Creating...' : 'Create Event'}
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default withBasicLayout(EventCreatePage);
