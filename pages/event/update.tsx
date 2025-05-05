import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { EventCategory } from '@/libs/enums/event.enum';
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
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '@/apollo/store';
import { GET_EVENT } from '@/apollo/user/query';
import { UPDATE_EVENT_BY_ORGANIZER } from '@/apollo/user/mutation';
import { smallError, smallSuccess } from '@/libs/alert';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Message } from '@/libs/enums/common.enum';
import axios from 'axios';
import { getJwtToken } from '@/libs/auth';
import { imageTypes, REACT_APP_API_URL } from '@/libs/config';
import { REACT_APP_API_GRAPHQL_URL } from '@/libs/config';
import { EventUpdateInput } from '@/libs/types/event/event.update';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const EventUpdatePage = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const token = getJwtToken();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
	const [formData, setFormData] = useState<EventUpdateInput | null>(null);

	/** APOLLO REQUESTS **/
	const [updateEventByOrganizer] = useMutation(UPDATE_EVENT_BY_ORGANIZER);
	const { data: eventData } = useQuery(GET_EVENT, {
		variables: { input: router.query.eventId },
		skip: !router.query.eventId,
	});

	useEffect(() => {
		if (eventData?.getEvent) {
			const event = eventData.getEvent;
			setFormData({
				_id: event._id,
				eventName: event.eventName,
				eventDesc: event.eventDesc,
				eventCategories: event.eventCategories,
				eventDate: new Date(event.eventDate),
				eventStartTime: event.eventStartTime,
				eventEndTime: event.eventEndTime,
				eventCity: event.eventCity,
				eventAddress: event.eventAddress,
				eventCapacity: event.eventCapacity,
				eventPrice: event.eventPrice,
				eventImage: event.eventImage,
			});
			setSelectedCategories(event.eventCategories);
			setImagePreview(`${REACT_APP_API_URL}/${event.eventImage}`);
		}
	}, [eventData]);

	/** HANDLERS */
	const validateTime = (startTime: string, endTime: string) => {
		const [startHour, startMinute] = startTime.split(':').map(Number);
		const [endHour, endMinute] = endTime.split(':').map(Number);

		if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
			return false;
		}
		return true;
	};

	const handleStartTimeChange = (hour: string, minute: string) => {
		const newStartTime = `${hour}:${minute}`;
		setFormData((prev) => (prev ? { ...prev, eventStartTime: newStartTime } : null));
	};

	const handleEndTimeChange = (hour: string, minute: string) => {
		const newEndTime = `${hour}:${minute}`;
		setFormData((prev) => (prev ? { ...prev, eventEndTime: newEndTime } : null));
	};

	const uploadImage = async (image: File) => {
		try {
			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'event',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.file'],
				}),
			);
			formData.append('0', image);

			const response = await axios.post(`${REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			const imageUrl = `${REACT_APP_API_URL}/${responseImage}`;

			// Update form data and preview
			setFormData((prev) => (prev ? { ...prev, eventImage: responseImage } : null));
			setImagePreview(imageUrl);

			return imageUrl;
		} catch (err) {
			console.error('Error uploading image:', err);
			smallError(t('Failed to upload image'));
			return null;
		}
	};

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			await uploadImage(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			if (!formData?._id) throw new Error(Message.EVENT_NOT_FOUND);
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!formData.eventName) throw new Error(t('Event name is required'));
			if (!formData.eventDesc) throw new Error(t('Event description is required'));
			if (selectedCategories.length === 0) throw new Error(Message.CATEGORY_NOT_FOUND);
			if (!formData.eventDate) throw new Error(t('Event date is required'));
			if (!formData.eventStartTime) throw new Error(t('Start time is required'));
			if (!formData.eventEndTime) throw new Error(t('End time is required'));
			if (!validateTime(formData.eventStartTime, formData.eventEndTime)) {
				throw new Error(Message.INVALID_TIME_SELECTION);
			}
			if (!formData.eventCity) throw new Error(t('City is required'));
			if (!formData.eventAddress) throw new Error(t('Address is required'));
			if (!formData.eventCapacity) throw new Error(t('Capacity is required'));
			if (formData.eventCapacity < 1) throw new Error(t('Capacity must be at least 1'));
			if (!formData.eventImage) throw new Error(t('Event image is required'));

			const updatedFormData = {
				...formData,
				eventCategories: selectedCategories,
			};

			await updateEventByOrganizer({
				variables: { input: updatedFormData },
			});

			await smallSuccess(t('Event updated successfully'));
			router.push(`/event/detail?eventId=${formData._id}`);
		} catch (error: unknown) {
			if (error instanceof Error) {
				smallError(error.message);
			} else {
				smallError(t('An unexpected error occurred'));
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;

		setFormData((prev) =>
			prev
				? {
						...prev,
						[name]: name === 'eventCapacity' || name === 'eventPrice' ? Number(value) : value,
					}
				: null,
		);
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

	if (!formData) return null;

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<Button
						variant="outline"
						onClick={() => router.push(`/event/detail?eventId=${formData._id}`)}
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
						{t('Back to Event')}
					</Button>
				</div>

				<Card className="p-6 bg-card text-card-foreground">
					<h1 className="text-3xl font-semibold text-foreground mb-6">{t('Update Event')}</h1>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Event Name */}
						<div className="space-y-2">
							<label htmlFor="eventName" className="text-sm font-medium text-foreground">
								{t('Event Name')}
							</label>
							<Input
								id="eventName"
								name="eventName"
								value={formData.eventName}
								onChange={handleInputChange}
								placeholder={t('Enter event name')}
								className="bg-input text-input-foreground border-input"
							/>
						</div>

						{/* Event Description */}
						<div className="space-y-2">
							<label htmlFor="eventDesc" className="text-sm font-medium text-foreground">
								{t('Description')}
							</label>
							<Textarea
								id="eventDesc"
								name="eventDesc"
								value={formData.eventDesc}
								onChange={handleInputChange}
								placeholder={t('Describe your event')}
								className="min-h-[120px] bg-input text-input-foreground border-input"
							/>
						</div>

						{/* Categories */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground">{t('Categories (Select up to 3)')}</label>
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
									{t('Event Date')}
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
											{formData.eventDate ? format(formData.eventDate, 'PPP') : <span>{t('Pick a date')}</span>}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0 bg-popover text-popover-foreground border-border">
										<Calendar
											mode="single"
											selected={formData.eventDate}
											onSelect={(date) => date && setFormData((prev) => (prev ? { ...prev, eventDate: date } : null))}
											initialFocus
											disabled={(date) => date < new Date()}
											className="rounded-md border"
										/>
									</PopoverContent>
								</Popover>
							</div>
							<div className="space-y-2">
								<label htmlFor="eventStartTime" className="text-sm font-medium text-foreground">
									{t('Start Time')}
								</label>
								<div className="flex gap-2">
									<Select
										value={formData.eventStartTime?.split(':')[0] ?? '00'}
										onValueChange={(hour) => {
											const currentTime = formData.eventStartTime?.split(':') ?? ['00', '00'];
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
										value={formData.eventStartTime?.split(':')[1] ?? '00'}
										onValueChange={(minute) => {
											const currentTime = formData.eventStartTime?.split(':') ?? ['00', '00'];
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
									{t('End Time')}
								</label>
								<div className="flex gap-2">
									<Select
										value={formData.eventEndTime?.split(':')[0] ?? '00'}
										onValueChange={(hour) => {
											const currentTime = formData.eventEndTime?.split(':') ?? ['00', '00'];
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
										value={formData.eventEndTime?.split(':')[1] ?? '00'}
										onValueChange={(minute) => {
											const currentTime = formData.eventEndTime?.split(':') ?? ['00', '00'];
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
							</div>
						</div>

						{/* Location */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor="eventCity" className="text-sm font-medium text-foreground">
									{t('City')}
								</label>
								<Input
									id="eventCity"
									name="eventCity"
									value={formData.eventCity}
									onChange={handleInputChange}
									placeholder={t('Enter city')}
									className="bg-input text-input-foreground border-input"
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="eventAddress" className="text-sm font-medium text-foreground">
									{t('Address')}
								</label>
								<Input
									id="eventAddress"
									name="eventAddress"
									value={formData.eventAddress}
									onChange={handleInputChange}
									placeholder={t('Enter address')}
									className="bg-input text-input-foreground border-input"
								/>
							</div>
						</div>

						{/* Capacity and Price */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor="eventCapacity" className="text-sm font-medium text-foreground">
									{t('Capacity')}
								</label>
								<Input
									id="eventCapacity"
									name="eventCapacity"
									type="number"
									value={formData.eventCapacity}
									onChange={handleInputChange}
									placeholder={t('Enter event capacity')}
									className="bg-input text-input-foreground border-input"
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="eventPrice" className="text-sm font-medium text-foreground">
									{t('Price')}
								</label>
								<Input
									id="eventPrice"
									name="eventPrice"
									type="number"
									min="0"
									value={formData.eventPrice}
									onChange={handleInputChange}
									placeholder={t('Enter event price')}
									className="bg-input text-input-foreground border-input"
								/>
							</div>
						</div>

						{/* Image Section */}
						<div className="space-y-4">
							<label className="text-sm font-medium text-foreground">{t('Event Image')}</label>
							<div className="relative aspect-video w-full max-w-2xl mx-auto rounded-xl overflow-hidden bg-muted/50">
								{imagePreview ? (
									<>
										<img src={imagePreview} alt="Event preview" className="object-contain w-full h-full" />
										<label
											htmlFor="image"
											className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors duration-200 cursor-pointer group"
										>
											<div className="flex items-center gap- bg-white/90 text-foreground px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
												<RefreshCw className="h-4 w-4" />
												<span className="font-medium">{t('Reset Image')}</span>
											</div>
										</label>
									</>
								) : (
									<label
										htmlFor="image"
										className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 hover:bg-muted/60 transition-colors duration-200 cursor-pointer"
									>
										<ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
										<span className="text-muted-foreground font-medium">{t('Click to upload image')}</span>
									</label>
								)}
								<input
									id="image"
									name="image"
									type="file"
									accept={imageTypes}
									onChange={handleImageChange}
									className="hidden"
								/>
								<p className="text-sm text-muted-foreground mt-1">{t('Only JPG, JPEG, and PNG files are allowed')}</p>
							</div>
						</div>

						{/* Submit Button */}
						<div className="flex justify-end">
							<Button
								type="submit"
								size="lg"
								disabled={
									isSubmitting ||
									selectedCategories.length === 0 ||
									!formData.eventDate ||
									!formData.eventCity ||
									!formData.eventAddress ||
									!formData.eventCapacity ||
									!formData.eventImage
								}
								className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-8"
							>
								{isSubmitting ? t('Updating...') : t('Update Event')}
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default withBasicLayout(EventUpdatePage);
