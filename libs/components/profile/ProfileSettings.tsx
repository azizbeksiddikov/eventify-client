import { useState } from 'react';
import { Member } from '@/libs/types/member/member';
import { MemberUpdateInput } from '@/libs/types/member/member.update';
import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Label } from '@/libs/components/ui/label';
import { Textarea } from '@/libs/components/ui/textarea';
import { ImageIcon } from 'lucide-react';

interface ProfileSettingsProps {
	member: Member;
	handleUpdateMember: (data: MemberUpdateInput) => void;
}

export const ProfileSettings = ({ member, handleUpdateMember }: ProfileSettingsProps) => {
	const [formData, setFormData] = useState<MemberUpdateInput>({
		username: member.username,
		memberEmail: member.memberEmail,
		memberPhone: member.memberPhone || '',
		memberFullName: member.memberFullName,
		memberDesc: member.memberDesc || '',
		memberImage: member.memberImage || '',
	});
	const [imagePreview, setImagePreview] = useState<string>(member.memberImage || '');

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const imageUrl = reader.result as string;
				setImagePreview(imageUrl);
				setFormData((prev) => ({ ...prev, memberImage: imageUrl }));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleUpdateMember(formData);
	};

	return (
		<div className="bg-white rounded-lg shadow">
			<div className="px-6 py-4 border-b border-gray-200">
				<h2 className="text-lg font-medium text-gray-900">Profile Settings</h2>
			</div>
			<form onSubmit={handleSubmit} className="p-6 space-y-6">
				{/* Image Upload Section */}
				<div className="space-y-4">
					<label className="text-sm font-medium text-gray-700">Profile Image</label>
					<div className="relative aspect-square w-32 mx-auto rounded-full overflow-hidden border border-gray-200">
						{imagePreview ? (
							<>
								<img src={imagePreview} alt="Profile preview" className="object-cover w-full h-full" />
								<label
									htmlFor="image"
									className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/50 transition-colors duration-200 cursor-pointer"
								>
									<span className="text-white font-medium opacity-0 hover:opacity-100 transition-opacity duration-200">
										Change Image
									</span>
								</label>
							</>
						) : (
							<label
								htmlFor="image"
								className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
							>
								<ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
								<span className="text-sm text-gray-500">Upload image</span>
							</label>
						)}
						<input
							id="image"
							name="image"
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="hidden"
						/>
					</div>
				</div>

				<div>
					<Label htmlFor="username">Username</Label>
					<Input
						id="username"
						value={formData.username}
						onChange={(e) => setFormData({ ...formData, username: e.target.value })}
					/>
				</div>

				<div>
					<Label htmlFor="fullName">Full Name</Label>
					<Input
						id="fullName"
						value={formData.memberFullName}
						onChange={(e) => setFormData({ ...formData, memberFullName: e.target.value })}
					/>
				</div>

				<div>
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						value={formData.memberEmail}
						onChange={(e) => setFormData({ ...formData, memberEmail: e.target.value })}
					/>
				</div>

				<div>
					<Label htmlFor="phone">Phone</Label>
					<Input
						id="phone"
						type="tel"
						value={formData.memberPhone}
						onChange={(e) => setFormData({ ...formData, memberPhone: e.target.value })}
					/>
				</div>

				<div>
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						value={formData.memberDesc}
						onChange={(e) => setFormData({ ...formData, memberDesc: e.target.value })}
						rows={4}
					/>
				</div>

				<div className="flex justify-end">
					<Button type="submit">Save Changes</Button>
				</div>
			</form>
		</div>
	);
};
