import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MemberInput } from '@/libs/types/member/member.input';
import { Button } from '@/libs/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { Input } from '@/libs/components/ui/input';
import { Label } from '@/libs/components/ui/label';

const ProfileEditPage = () => {
	const router = useRouter();
	const [member, setMember] = useState<MemberInput | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [formData, setFormData] = useState({
		username: '',
		memberEmail: '',
		memberFullName: '',
		memberPhone: '',
		memberType: 'USER',
	});

	useEffect(() => {
		fetchProfileData();
	}, []);

	const fetchProfileData = async () => {
		setIsLoading(true);
		try {
			// TODO: Replace with actual API call
			const mockMember: MemberInput = {
				username: 'johndoe',
				memberEmail: 'john.doe@example.com',
				memberPassword: '********',
				memberFullName: 'John Doe',
				memberPhone: '+1 (555) 123-4567',
				memberType: 'USER',
			};

			setMember(mockMember);
			setFormData({
				username: mockMember.username,
				memberEmail: mockMember.memberEmail,
				memberFullName: mockMember.memberFullName,
				memberPhone: mockMember.memberPhone || '',
				memberType: mockMember.memberType || 'USER',
			});
		} catch (error) {
			console.error('Failed to fetch profile data:', error);
			setError('Failed to fetch profile data');
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
			console.log('Updating profile with:', formData);
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			router.push('/profile/1'); // TODO: Replace with actual user ID
		} catch (error) {
			console.error('Failed to update profile:', error);
			setError('Failed to update profile');
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-primary">Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-destructive">Error: {error}</div>
			</div>
		);
	}

	if (!member) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-primary">Profile not found</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background py-12">
			<div className="max-w-2xl mx-auto px-4">
				<Card className="bg-card">
					<CardHeader>
						<CardTitle className="text-card-foreground text-2xl font-semibold">Edit Profile</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-4">
								<div>
									<Label htmlFor="username" className="text-card-foreground">
										Username
									</Label>
									<Input
										id="username"
										name="username"
										value={formData.username}
										onChange={handleChange}
										required
										className="bg-background text-foreground border-input"
									/>
								</div>
								<div>
									<Label htmlFor="memberEmail" className="text-card-foreground">
										Email
									</Label>
									<Input
										id="memberEmail"
										name="memberEmail"
										type="email"
										value={formData.memberEmail}
										onChange={handleChange}
										required
										className="bg-background text-foreground border-input"
									/>
								</div>
								<div>
									<Label htmlFor="memberFullName" className="text-card-foreground">
										Full Name
									</Label>
									<Input
										id="memberFullName"
										name="memberFullName"
										value={formData.memberFullName}
										onChange={handleChange}
										required
										className="bg-background text-foreground border-input"
									/>
								</div>
								<div>
									<Label htmlFor="memberPhone" className="text-card-foreground">
										Phone Number
									</Label>
									<Input
										id="memberPhone"
										name="memberPhone"
										type="tel"
										value={formData.memberPhone}
										onChange={handleChange}
										className="bg-background text-foreground border-input"
									/>
								</div>
							</div>

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
									{isLoading ? 'Saving...' : 'Save Changes'}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default ProfileEditPage;
