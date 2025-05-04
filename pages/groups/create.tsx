import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Textarea } from '@/libs/components/ui/textarea';
import { Card } from '@/libs/components/ui/card';
import { ImageIcon, RefreshCw } from 'lucide-react';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { GroupInput } from '@/libs/types/group/group.input';
import { useMutation } from '@apollo/client';
import { CREATE_GROUP } from '@/apollo/user/mutation';
import { smallError, smallSuccess } from '@/libs/alert';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import axios from 'axios';
import { getJwtToken } from '@/libs/auth';
import { REACT_APP_API_URL, REACT_APP_API_GRAPHQL_URL } from '@/libs/config';
import { GroupCategory } from '@/libs/enums/group.enum';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const GroupCreatePage = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const token = getJwtToken();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const [formData, setFormData] = useState<GroupInput>({
		name: '',
		description: '',
		image: '',
		category: GroupCategory.OTHER,
		organizerId: '', // This will be set from the current user
		membersCount: 1,
		eventsCount: 0,
	});

	/** APOLLO REQUESTS **/
	const [createGroup] = useMutation(CREATE_GROUP);

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
						target: 'group',
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

			setFormData((prev) => ({ ...prev, image: responseImage }));
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

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			if (!formData.name) throw new Error(t('Group name is required'));
			if (!formData.description) throw new Error(t('Group description is required'));
			if (!formData.image) throw new Error(t('Group image is required'));

			await createGroup({
				variables: { input: formData },
			});

			await smallSuccess(t('Group created successfully'));
			router.push('/groups');
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
						{t('Back to Groups')}
					</Button>
				</div>

				<Card className="p-6 bg-card text-card-foreground">
					<h1 className="text-3xl font-semibold text-foreground mb-6">{t('Create New Group')}</h1>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Group Name */}
						<div className="space-y-2">
							<label htmlFor="name" className="text-sm font-medium text-foreground">
								{t('Group Name')}
							</label>
							<Input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder={t('Enter group name')}
								className="bg-input text-input-foreground border-input"
							/>
						</div>

						{/* Group Description */}
						<div className="space-y-2">
							<label htmlFor="description" className="text-sm font-medium text-foreground">
								{t('Description')}
							</label>
							<Textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								placeholder={t('Describe your group')}
								className="min-h-[120px] bg-input text-input-foreground border-input"
							/>
						</div>

						{/* Group Category */}
						<div className="space-y-2">
							<label htmlFor="category" className="text-sm font-medium text-foreground">
								{t('Group Category')}
							</label>
							<select
								id="category"
								name="category"
								value={formData.category}
								onChange={handleInputChange}
								className="w-full bg-input text-input-foreground border-input rounded-md px-3 py-2"
							>
								{Object.values(GroupCategory).map((category) => (
									<option key={category} value={category}>
										{t(category)}
									</option>
								))}
							</select>
						</div>

						{/* Image Section */}
						<div className="space-y-4">
							<label className="text-sm font-medium text-foreground">{t('Group Image')}</label>
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
									accept=".jpg,.jpeg,.png,image/jpeg,image/png"
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
								disabled={isSubmitting || !formData.name || !formData.description || !formData.image}
								className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-8"
							>
								{isSubmitting ? t('Creating...') : t('Create Group')}
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default withBasicLayout(GroupCreatePage);
