import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Textarea } from '@/libs/components/ui/textarea';
import { Card } from '@/libs/components/ui/card';
import { ImageIcon, RefreshCw } from 'lucide-react';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { GroupCategory } from '@/libs/enums/group.enum';
import { GroupInput } from '@/libs/types/group/group.input';

const GroupCreatePage = () => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [selectedCategories, setSelectedCategories] = useState<GroupCategory[]>([]);

	const [formData, setFormData] = useState<GroupInput>({
		name: '',
		description: '',
		image: '',
		category: GroupCategory.OTHER,
		organizerId: '', // This should be set from the current user
		membersCount: 1, // Start with 1 member (the organizer)
		eventsCount: 0,
	});

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const result = reader.result as string;
				setImagePreview(result);
				setFormData((prev) => ({ ...prev, image: result }));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			// TODO: Implement group creation API call with image upload
			console.log('Creating group:', { ...formData, categories: selectedCategories });
			router.push('/groups');
		} catch (error) {
			console.error('Error creating group:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleCategorySelect = (category: GroupCategory) => {
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
						onClick={() => router.push('/groups')}
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
						Back to Groups
					</Button>
				</div>

				<Card className="p-6 bg-card text-card-foreground">
					<h1 className="text-3xl font-semibold text-foreground mb-6">Create New Group</h1>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Group Name */}
						<div className="space-y-2">
							<label htmlFor="name" className="text-sm font-medium text-foreground">
								Group Name
							</label>
							<Input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="Enter group name"
								className="bg-input text-input-foreground border-input"
								required
							/>
						</div>

						{/* Group Description */}
						<div className="space-y-2">
							<label htmlFor="description" className="text-sm font-medium text-foreground">
								Description
							</label>
							<Textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								placeholder="Describe your group"
								className="min-h-[120px] bg-input text-input-foreground border-input"
								required
							/>
						</div>

						{/* Categories */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground">Categories (Select up to 3)</label>
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
								{Object.values(GroupCategory).map((category) => (
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

						{/* Image Section */}
						<div className="space-y-4">
							<label className="text-sm font-medium text-foreground">Group Image</label>
							<div className="relative aspect-video w-full max-w-2xl mx-auto rounded-xl overflow-hidden bg-muted/50">
								{imagePreview ? (
									<>
										<img src={imagePreview} alt="Group preview" className="object-contain w-full h-full" />
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
								{isSubmitting ? 'Creating...' : 'Create Group'}
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default withBasicLayout(GroupCreatePage);
