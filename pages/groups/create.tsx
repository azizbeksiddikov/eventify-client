import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/libs/components/ui/card';
import { ImageIcon, X } from 'lucide-react';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { GroupCategory } from '@/libs/enums/group.enum';
import { GroupInput } from '@/libs/types/group/group.input';
import { Badge } from '@/libs/components/ui/badge';

const GroupCreatePage = () => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [imagePreview, setImagePreview] = useState<string>('');
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

	const removeCategory = (category: GroupCategory) => {
		setSelectedCategories((prev) => prev.filter((c) => c !== category));
	};

	return (
		<div className="min-h-screen bg-background py-8">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-8">
					<Button
						variant="ghost"
						onClick={() => router.push('/groups')}
						className="text-muted-foreground hover:text-foreground transition-colors duration-200"
					>
						← Back to Groups
					</Button>
				</div>

				<Card className="p-6">
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
								{Object.values(GroupCategory).map((category) => (
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

						{/* Image Section */}
						<div className="space-y-4">
							<label className="text-sm font-medium text-foreground">Group Image</label>
							<div className="relative aspect-video w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-border/50">
								{imagePreview ? (
									<>
										<img src={imagePreview} alt="Group preview" className="object-contain w-full h-full bg-muted/50" />
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
