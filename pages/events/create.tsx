import { useState } from 'react';
import { useRouter } from 'next/router';
import { EventCategory } from '@/libs/enums/event.enum';
import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/libs/components/ui/card';
import { Badge } from '@/libs/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Users, DollarSign, ImageIcon } from 'lucide-react';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';

// Mock data for user's groups
const userGroups = [
	{
		id: '1',
		name: 'Tech Enthusiasts',
		role: 'owner',
		image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
	},
	{
		id: '2',
		name: 'Design Community',
		role: 'admin',
		image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
	},
	{
		id: '3',
		name: 'Startup Founders',
		role: 'admin',
		image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
	},
];

const EventCreatePage = () => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [imagePreview, setImagePreview] = useState<string>('');

	const [formData, setFormData] = useState({
		eventName: '',
		eventDesc: '',
		eventImage: '',
		eventDate: '',
		eventStartTime: '',
		eventEndTime: '',
		eventAddress: '',
		eventCapacity: '',
		eventPrice: '',
		eventCategories: [] as EventCategory[],
		groupId: '',
	});

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			// TODO: Implement event creation API call with image upload
			console.log('Creating event:', formData);
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

	const handleCategoryToggle = (category: EventCategory) => {
		setFormData((prev) => ({
			...prev,
			eventCategories: prev.eventCategories.includes(category)
				? prev.eventCategories.filter((c) => c !== category)
				: [...prev.eventCategories, category],
		}));
	};

	return (
		<div className="min-h-screen bg-background py-8">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-8">
					<Button
						variant="ghost"
						onClick={() => router.push('/events')}
						className="text-muted-foreground hover:text-foreground transition-colors duration-200"
					>
						← Back to Events
					</Button>
				</div>

				<Card className="p-6">
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
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a group">
										{formData.groupId && (
											<div className="flex items-center space-x-3">
												<div className="relative h-8 w-8 rounded-full overflow-hidden">
													<img
														src={userGroups.find((g) => g.id === formData.groupId)?.image}
														alt="Group preview"
														className="object-cover w-full h-full"
													/>
												</div>
												<span>{userGroups.find((g) => g.id === formData.groupId)?.name}</span>
											</div>
										)}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{userGroups.map((group) => (
										<SelectItem key={group.id} value={group.id} className="py-3">
											<div className="flex items-center space-x-4">
												<div className="relative h-10 w-10 rounded-full overflow-hidden">
													<img src={group.image} alt={group.name} className="object-cover w-full h-full" />
												</div>
												<div>
													<div className="font-medium">{group.name}</div>
													<div className="text-xs text-muted-foreground">{group.role}</div>
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
								className="min-h-[120px]"
								required
							/>
						</div>

						{/* Date and Time */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label htmlFor="eventDate" className="text-sm font-medium text-foreground">
									Event Date
								</label>
								<div className="relative">
									<Input
										id="eventDate"
										name="eventDate"
										type="date"
										value={formData.eventDate}
										onChange={handleInputChange}
										className="pl-10"
										required
									/>
								</div>
							</div>
							<div className="space-y-2">
								<div className="grid grid-cols-2 gap-4">
									<div className="relative">
										<label htmlFor="eventTime" className="text-sm font-medium text-foreground">
											Start Time
										</label>
										<div className="flex items-center gap-2">
											<Select
												value={formData.eventStartTime.split(':')[0]}
												onValueChange={(hour) => {
													const [_, minutes] = formData.eventStartTime.split(':');
													handleInputChange({
														target: { name: 'eventStartTime', value: `${hour}:${minutes}` },
													} as React.ChangeEvent<HTMLInputElement>);
												}}
											>
												<SelectTrigger className="h-14">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map((hour) => (
														<SelectItem key={hour} value={hour} className="py-3">
															{hour}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<span className="text-foreground/50">:</span>
											<Select
												value={formData.eventStartTime.split(':')[1]}
												onValueChange={(minute) => {
													const [hour] = formData.eventStartTime.split(':');
													handleInputChange({
														target: { name: 'eventStartTime', value: `${hour}:${minute}` },
													} as React.ChangeEvent<HTMLInputElement>);
												}}
											>
												<SelectTrigger className="h-14">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{['00', '15', '30', '45'].map((minute) => (
														<SelectItem key={minute} value={minute} className="py-3">
															{minute}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
									<div className="relative">
										<label htmlFor="eventTime" className="text-sm font-medium text-foreground">
											End Time
										</label>
										<div className="flex items-center gap-2">
											<Select
												value={formData.eventEndTime.split(':')[0]}
												onValueChange={(hour) => {
													const [_, minutes] = formData.eventEndTime.split(':');
													handleInputChange({
														target: { name: 'eventEndTime', value: `${hour}:${minutes}` },
													} as React.ChangeEvent<HTMLInputElement>);
												}}
											>
												<SelectTrigger className="h-14">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map((hour) => (
														<SelectItem key={hour} value={hour} className="py-3">
															{hour}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<span className="text-foreground/50">:</span>
											<Select
												value={formData.eventEndTime.split(':')[1]}
												onValueChange={(minute) => {
													const [hour] = formData.eventEndTime.split(':');
													handleInputChange({
														target: { name: 'eventEndTime', value: `${hour}:${minute}` },
													} as React.ChangeEvent<HTMLInputElement>);
												}}
											>
												<SelectTrigger className="h-14">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{['00', '15', '30', '45'].map((minute) => (
														<SelectItem key={minute} value={minute} className="py-3">
															{minute}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Location and Capacity */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label htmlFor="eventAddress" className="text-sm font-medium text-foreground">
									Location
								</label>
								<div className="relative">
									<Input
										id="eventAddress"
										name="eventAddress"
										value={formData.eventAddress}
										onChange={handleInputChange}
										placeholder="Enter event location"
										className="pl-10"
										required
									/>
								</div>
							</div>
							<div className="space-y-2">
								<label htmlFor="eventCapacity" className="text-sm font-medium text-foreground">
									Capacity
								</label>
								<div className="relative">
									<Input
										id="eventCapacity"
										name="eventCapacity"
										type="number"
										value={formData.eventCapacity}
										onChange={handleInputChange}
										placeholder="Enter capacity"
										className="pl-10"
										required
									/>
								</div>
							</div>
						</div>

						{/* Price */}
						<div className="space-y-2">
							<label htmlFor="eventPrice" className="text-sm font-medium text-foreground">
								Price
							</label>
							<div className="relative">
								<Input
									id="eventPrice"
									name="eventPrice"
									type="number"
									value={formData.eventPrice}
									onChange={handleInputChange}
									placeholder="Enter price"
									className="pl-10"
									required
								/>
							</div>
						</div>

						{/* Categories */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground">Categories</label>
							<div className="flex flex-wrap gap-2">
								{Object.values(EventCategory).map((category) => (
									<Badge
										key={category}
										variant={formData.eventCategories.includes(category) ? 'default' : 'outline'}
										className="cursor-pointer"
										onClick={() => handleCategoryToggle(category)}
									>
										{category}
									</Badge>
								))}
							</div>
						</div>

						{/* Image Section */}
						<div className="space-y-4">
							<label className="text-sm font-medium text-foreground">Event Image</label>
							<div className="relative aspect-video w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-border/50">
								{imagePreview ? (
									<>
										<img src={imagePreview} alt="Event preview" className="object-contain w-full h-full bg-muted/50" />
										<label
											htmlFor="eventImage"
											className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/50 transition-colors duration-200 cursor-pointer"
										>
											<span className="text-white font-medium opacity-0 hover:opacity-100 transition-opacity duration-200">
												Click to change image
											</span>
										</label>
									</>
								) : (
									<label
										htmlFor="eventImage"
										className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 hover:bg-muted/60 transition-colors duration-200 cursor-pointer"
									>
										<ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
										<span className="text-muted-foreground font-medium">Click to upload image</span>
									</label>
								)}
								<input
									id="eventImage"
									name="eventImage"
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="hidden"
									required
								/>
							</div>
						</div>

						{/* Submit Button */}
						<div className="flex justify-end">
							<Button
								type="submit"
								size="lg"
								disabled={isSubmitting}
								className="bg-primary/90 hover:bg-primary text-primary-foreground px-8"
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
