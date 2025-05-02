import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Eye, EyeOff } from 'lucide-react';
import { Toaster } from 'sonner';

import { MemberInput } from '@/libs/types/member/member.input';
import withAuthLayout from '@/libs/components/layout/LayoutAuth';
import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { smallError } from '@/libs/alert';
import { Message } from '@/libs/enums/common.enum';
import { signUp } from '@/libs/auth';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

interface SignupForm extends MemberInput {
	confirmPassword: string;
}

const Signup = () => {
	const router = useRouter();
	const [formData, setFormData] = useState<SignupForm>({
		username: '',
		memberEmail: '',
		memberPassword: '',
		memberFullName: '',
		confirmPassword: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleInput = (name: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const validateForm = () => {
		if (!formData.username.trim()) {
			smallError(Message.USERNAME_REQUIRED);
			return false;
		}

		if (!formData.memberEmail.trim()) {
			smallError(Message.EMAIL_REQUIRED);
			return false;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.memberEmail)) {
			smallError(Message.INVALID_EMAIL);
			return false;
		}

		if (!formData.memberFullName.trim()) {
			smallError(Message.FULL_NAME_REQUIRED);
			return false;
		}

		if (!formData.memberPassword) {
			smallError(Message.PASSWORD_REQUIRED);
			return false;
		} else if (formData.memberPassword.length < 8) {
			smallError(Message.PASSWORD_TOO_SHORT);
			return false;
		}

		if (!formData.confirmPassword) {
			smallError(Message.CONFIRM_PASSWORD_REQUIRED);
			return false;
		} else if (formData.confirmPassword !== formData.memberPassword) {
			smallError(Message.PASSWORDS_DONT_MATCH);
			return false;
		}

		return true;
	};

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (!validateForm()) return;

			setIsLoading(true);
			try {
				await signUp(formData.username, formData.memberPassword, formData.memberEmail, formData.memberFullName);
				await router.push(`${router.query.referrer ?? '/'}`);
			} catch (err: unknown) {
				const error = err as Error;
				smallError(error.message);
			} finally {
				setIsLoading(false);
			}
		},
		[formData, router],
	);

	return (
		<>
			<Toaster position="top-right" richColors visibleToasts={1} />
			<div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 sm:px-6 lg:px-8">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<CardTitle className="text-3xl font-semibold">Create your account</CardTitle>
						<CardDescription>
							Or{' '}
							<Link
								href="/auth/login"
								className="font-medium text-primary hover:text-primary/80 transition-colors duration-300 underline"
							>
								sign in to your account
							</Link>
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form className="space-y-6" onSubmit={handleSubmit}>
							<div className="space-y-4">
								<div className="space-y-2">
									<label htmlFor="username" className="text-sm font-medium">
										Username
									</label>
									<Input
										id="username"
										name="username"
										type="text"
										autoComplete="username"
										value={formData.username}
										onChange={(e) => handleInput(e.target.name, e.target.value)}
										placeholder="Enter your username"
									/>
								</div>

								<div className="space-y-2">
									<label htmlFor="memberEmail" className="text-sm font-medium">
										Email address
									</label>
									<Input
										id="memberEmail"
										name="memberEmail"
										type="text"
										autoComplete="email"
										value={formData.memberEmail}
										onChange={(e) => handleInput(e.target.name, e.target.value)}
										placeholder="Enter your email"
									/>
								</div>

								<div className="space-y-2">
									<label htmlFor="memberFullName" className="text-sm font-medium">
										Full name
									</label>
									<Input
										id="memberFullName"
										name="memberFullName"
										type="text"
										autoComplete="name"
										value={formData.memberFullName}
										onChange={(e) => handleInput(e.target.name, e.target.value)}
										placeholder="Enter your full name"
									/>
								</div>

								<div className="space-y-2">
									<label htmlFor="memberPassword" className="text-sm font-medium">
										Password
									</label>
									<div className="relative">
										<Input
											id="memberPassword"
											name="memberPassword"
											type={showPassword ? 'text' : 'password'}
											autoComplete="new-password"
											value={formData.memberPassword}
											onChange={(e) => handleInput(e.target.name, e.target.value)}
											placeholder="Enter your password"
											className="pr-10"
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
										>
											{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
										</Button>
									</div>
								</div>

								<div className="space-y-2">
									<label htmlFor="confirmPassword" className="text-sm font-medium">
										Confirm password
									</label>
									<div className="relative">
										<Input
											id="confirmPassword"
											name="confirmPassword"
											type={showConfirmPassword ? 'text' : 'password'}
											autoComplete="new-password"
											value={formData.confirmPassword}
											onChange={(e) => handleInput(e.target.name, e.target.value)}
											placeholder="Confirm your password"
											className="pr-10"
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => setShowConfirmPassword(!showConfirmPassword)}
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
										>
											{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
										</Button>
									</div>
								</div>
							</div>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? 'Creating account...' : 'Create account'}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default withAuthLayout(Signup);
