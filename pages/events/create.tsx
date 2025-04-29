import { useState } from 'react';
import { useRouter } from 'next/router';
import { EventCategory, EventStatus } from '@/libs/enums/event.enum';
import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/libs/components/ui/card';
import { Badge } from '@/libs/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageIcon, X } from 'lucide-react';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { EventInput } from '@/libs/types/event/event.input';

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
	const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);

	const [formData, setFormData] = useState<EventInput>({
		eventName: '',
		eventDesc: '',
		eventImage: '',
		eventDate: new Date(),
		eventStartTime: '',
		eventEndTime: '',
		eventAddress: '',
		eventCapacity: 0,
		eventPrice: 0,
		eventStatus: EventStatus.UPCOMING,
		eventCategories: [],
		groupId: '',
	});

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
				setFormData((prev) => ({ ...prev, image: reader.result as string }));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			// TODO: Implement event creation API call with image upload
			console.log('Creating event:', { ...formData, categories: selectedCategories });
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
		if (selectedCategories.length >= 3 && !selectedCategories.includes(category)) {
			return; // Don't allow more than 3 categories
		}
		setSelectedCategories((prev) => {
			if (prev.includes(category)) {
				return prev.filter((c) => c !== category);
			}
			return [...prev, category];
		});
	};

	const removeCategory = (category: EventCategory) => {
		setSelectedCategories((prev) => prev.filter((c) => c !== category));
	};

	return (
		<div className="min-h-screen bg-background">
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
								value={formData.organizerId}
								onValueChange={(value: string) => setFormData((prev) => ({ ...prev, organizerId: value }))}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a group">
										{formData.organizerId && (
											<div className="flex items-center space-x-3">
												<div className="relative h-8 w-8 rounded-full overflow-hidden">
													<img
														src={userGroups.find((g) => g.id === formData.organizerId)?.image}
														alt="Group preview"
														className="object-cover w-full h-full"
													/>
												</div>
												<span>{userGroups.find((g) => g.id === formData.organizerId)?.name}</span>
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
							<label htmlFor="name" className="text-sm font-medium text-foreground">
								Event Name
							</label>
							<Input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="Enter event name"
								required
							/>
						</div>

						{/* Event Description */}
						<div className="space-y-2">
							<label htmlFor="description" className="text-sm font-medium text-foreground">
								Description
							</label>
							<Textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								placeholder="Describe your event"
								className="min-h-[120px]"
								required
							/>
						</div>

						{/* Categories */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground">Categories (Select up to 3)</label>
							<div className="flex flex-wrap gap-2 mb-2">
								{selectedCategories.map((category) => (
									<Badge
										key={category}
										variant="secondary"
										className="flex items-center gap-1 bg-primary/10 text-primary"
									>
										{category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' ')}
										<button type="button" onClick={() => removeCategory(category)} className="hover:text-primary/80">
											<X className="h-3 w-3" />
										</button>
									</Badge>
								))}
							</div>
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
								{Object.values(EventCategory).map((category) => (
									<Button
										key={category}
										type="button"
										variant={selectedCategories.includes(category) ? 'default' : 'outline'}
										onClick={() => handleCategorySelect(category)}
										disabled={selectedCategories.length >= 3 && !selectedCategories.includes(category)}
										className="h-10"
									>
										{category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' ')}
									</Button>
								))}
							</div>
						</div>

						{/* Event Date and Time */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor="startDate" className="text-sm font-medium text-foreground">
									Start Date
								</label>
								<Input
									id="startDate"
									name="startDate"
									type="datetime-local"
									value={formData.startDate.toISOString().slice(0, 16)}
									onChange={(e) => setFormData((prev) => ({ ...prev, startDate: new Date(e.target.value) }))}
									required
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="endDate" className="text-sm font-medium text-foreground">
									End Date
								</label>
								<Input
									id="endDate"
									name="endDate"
									type="datetime-local"
									value={formData.endDate.toISOString().slice(0, 16)}
									onChange={(e) => setFormData((prev) => ({ ...prev, endDate: new Date(e.target.value) }))}
									required
								/>
							</div>
						</div>

						{/* Location */}
						<div className="space-y-2">
							<label htmlFor="location" className="text-sm font-medium text-foreground">
								Location
							</label>
							<Input
								id="location"
								name="location"
								value={formData.location}
								onChange={handleInputChange}
								placeholder="Enter event location"
								required
							/>
						</div>

						{/* Capacity and Price */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor="capacity" className="text-sm font-medium text-foreground">
									Capacity
								</label>
								<Input
									id="capacity"
									name="capacity"
									type="number"
									min="1"
									value={formData.capacity}
									onChange={handleInputChange}
									placeholder="Enter event capacity"
									required
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="price" className="text-sm font-medium text-foreground">
									Price
								</label>
								<Input
									id="price"
									name="price"
									type="number"
									min="0"
									step="0.01"
									value={formData.price}
									onChange={handleInputChange}
									placeholder="Enter event price"
									required
								/>
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
											htmlFor="image"
											className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/50 transition-colors duration-200 cursor-pointer"
										>
											<span className="text-white font-medium opacity-0 hover:opacity-100 transition-opacity duration-200">
												Reset Image
											</span>
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
								disabled={isSubmitting || selectedCategories.length === 0}
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
