import Image from 'next/image';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ImageIcon } from 'lucide-react';

import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Label } from '@/libs/components/ui/label';
import { Textarea } from '@/libs/components/ui/textarea';

import { REACT_APP_API_URL, imageTypes } from '@/libs/config';
import { getJwtToken } from '@/libs/auth';
import { smallError } from '@/libs/alert';
import { MemberUpdateInput } from '@/libs/types/member/member.update';
import { Message } from '@/libs/enums/common.enum';

interface ProfileSettingsProps {
	handleUpdateMember: (data: MemberUpdateInput) => void;
	memberUpdateInput: MemberUpdateInput;
	setMemberUpdateInput: (data: MemberUpdateInput) => void;
}

export const ProfileSettings = ({
	handleUpdateMember,
	memberUpdateInput,
	setMemberUpdateInput,
}: ProfileSettingsProps) => {
	const { t } = useTranslation('common');
	const token = getJwtToken();

	/** HANDLERS */
	const uploadImage = async (e: any) => {
		try {
			const image = e.target.files[0];

			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'member',
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

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			setMemberUpdateInput({ ...memberUpdateInput, memberImage: responseImage });
		} catch (err) {
			console.log('Error, uploadImage:', err);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Validate email if it's being updated
		if (memberUpdateInput.memberEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberUpdateInput.memberEmail)) {
			smallError(Message.INVALID_EMAIL);
			return;
		}

		handleUpdateMember(memberUpdateInput);
	};

	return (
		<div className="bg-card rounded-xl shadow-sm">
			<div className="px-6 py-4 border-b border-border">
				<h2 className="text-lg font-medium text-card-foreground">{t('Profile Settings')}</h2>
			</div>
			<form onSubmit={handleSubmit} className="p-6 space-y-6">
				{/* Image Upload Section */}
				<div className="space-y-4">
					<Label className="text-sm font-medium text-card-foreground">{t('Profile Image')}</Label>
					<div className="relative aspect-square w-32 mx-auto rounded-full overflow-hidden border border-border">
						{memberUpdateInput.memberImage ? (
							<>
								<Image
									src={`${REACT_APP_API_URL}/${memberUpdateInput.memberImage}`}
									alt="Profile preview"
									className="object-cover w-full h-full"
								/>
								<label
									htmlFor="image"
									className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/50 transition-colors duration-200 cursor-pointer"
								>
									<span className="text-white font-medium opacity-0 hover:opacity-100 transition-opacity duration-200">
										{t('Change Image')}
									</span>
								</label>
							</>
						) : (
							<label
								htmlFor="image"
								className="absolute inset-0 flex flex-col items-center justify-center bg-muted hover:bg-muted/80 transition-colors duration-200 cursor-pointer"
							>
								<ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
								<span className="text-sm text-muted-foreground">{t('Upload image')}</span>
							</label>
						)}
						<input
							id="image"
							name="image"
							type="file"
							accept={imageTypes}
							onChange={(e) => {
								uploadImage(e);
							}}
							className="hidden"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="username">{t('Username')}</Label>
					<Input
						id="username"
						value={memberUpdateInput.username}
						onChange={(e) => setMemberUpdateInput({ ...memberUpdateInput, username: e.target.value })}
						className="bg-background"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="fullName">{t('Full Name')}</Label>
					<Input
						id="fullName"
						value={memberUpdateInput.memberFullName}
						onChange={(e) => setMemberUpdateInput({ ...memberUpdateInput, memberFullName: e.target.value })}
						className="bg-background"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="email">{t('Email')}</Label>
					<Input
						id="email"
						value={memberUpdateInput.memberEmail}
						onChange={(e) => setMemberUpdateInput({ ...memberUpdateInput, memberEmail: e.target.value })}
						className="bg-background"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="phone">{t('Phone')}</Label>
					<Input
						id="phone"
						type="tel"
						value={memberUpdateInput.memberPhone}
						onChange={(e) => setMemberUpdateInput({ ...memberUpdateInput, memberPhone: e.target.value })}
						className="bg-background"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="description">{t('Description')}</Label>
					<Textarea
						id="description"
						value={memberUpdateInput.memberDesc}
						onChange={(e) => setMemberUpdateInput({ ...memberUpdateInput, memberDesc: e.target.value })}
						rows={4}
						className="bg-background"
					/>
				</div>

				<div className="flex justify-end">
					<Button type="submit">{t('Save Changes')}</Button>
				</div>
			</form>
		</div>
	);
};
