import { useCallback, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, User, Star } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/libs/components/ui/radio-group';
import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Label } from '@/libs/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/libs/components/ui/tooltip';

import withAuthLayout from '@/libs/components/layout/LayoutAuth';
import { MemberInput } from '@/libs/types/member/member.input';
import { MemberType } from '@/libs/enums/member.enum';
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
	const { t } = useTranslation('common');
	const [formData, setFormData] = useState<SignupForm>({
		username: '',
		memberEmail: '',
		memberPassword: '',
		memberFullName: '',
		confirmPassword: '',
		memberType: MemberType.USER,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleInput = (name: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[name]: name === 'username' ? value.toLowerCase() : value,
		}));
	};

	const handleMemberTypeChange = (value: MemberType) => {
		setFormData((prev) => ({
			...prev,
			memberType: value,
		}));
	};

	const validateForm = () => {
		if (!formData.username.trim()) {
			smallError(t(Message.USERNAME_REQUIRED));
			return false;
		}

		if (!formData.memberEmail.trim()) {
			smallError(t(Message.EMAIL_REQUIRED));
			return false;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.memberEmail)) {
			smallError(t(Message.INVALID_EMAIL));
			return false;
		}

		if (!formData.memberFullName.trim()) {
			smallError(t(Message.FULL_NAME_REQUIRED));
			return false;
		}

		if (!formData.memberPassword) {
			smallError(t(Message.PASSWORD_REQUIRED));
			return false;
		} else if (formData.memberPassword.length < 8) {
			smallError(t(Message.PASSWORD_TOO_SHORT));
			return false;
		}

		if (!formData.confirmPassword) {
			smallError(t(Message.CONFIRM_PASSWORD_REQUIRED));
			return false;
		} else if (formData.confirmPassword !== formData.memberPassword) {
			smallError(t(Message.PASSWORDS_DONT_MATCH));
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
				await signUp(
					formData.username,
					formData.memberPassword,
					formData.memberEmail,
					formData.memberFullName,
					formData.memberType ?? MemberType.USER,
				);
				await router.push(`${router.query.referrer ?? '/'}`);
			} catch (err: unknown) {
				console.log('err', err);
			} finally {
				setIsLoading(false);
			}
		},
		[formData, router],
	);

	return (
		<div className="flex-1 my-10 flex items-center justify-center px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-3xl font-semibold">{t('Create your account')}</CardTitle>
					<CardDescription>
						{t('Or')}{' '}
						<Link
							href="/auth/login"
							className="font-medium text-primary hover:text-primary/80 transition-colors duration-300 underline"
						>
							{t('sign in to your account')}
						</Link>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label className="text-sm font-medium block text-center mb-4">{t('Account Type')}</Label>
								<TooltipProvider>
									<RadioGroup
										defaultValue={MemberType.USER}
										value={formData.memberType}
										onValueChange={handleMemberTypeChange}
										className="flex flex-row justify-center gap-8"
									>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="flex items-center space-x-2">
													<RadioGroupItem
														value={MemberType.USER}
														id="user"
														className="peer sr-only"
														aria-label={t('User account type')}
													/>
													<Label
														htmlFor="user"
														className="flex items-center gap-2 cursor-pointer rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
													>
														<User className="h-4 w-4" />
														<span className="text-sm font-medium">{t('User')}</span>
													</Label>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p>{t('Regular user account for attending events')}</p>
											</TooltipContent>
										</Tooltip>

										<Tooltip>
											<TooltipTrigger asChild>
												<div className="flex items-center space-x-2">
													<RadioGroupItem
														value={MemberType.ORGANIZER}
														id="organizer"
														className="peer sr-only"
														aria-label={t('Organizer account type')}
													/>
													<Label
														htmlFor="organizer"
														className="flex items-center gap-2 cursor-pointer rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
													>
														<Star className="h-4 w-4" />
														<span className="text-sm font-medium">{t('Organizer')}</span>
													</Label>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p>{t('Create and manage your own events')}</p>
											</TooltipContent>
										</Tooltip>
									</RadioGroup>
								</TooltipProvider>
							</div>

							<div className="space-y-2">
								<Label htmlFor="username" className="text-sm font-medium">
									{t('Username')}
								</Label>
								<Input
									id="username"
									name="username"
									type="text"
									autoComplete="username"
									value={formData.username}
									onChange={(e) => handleInput(e.target.name, e.target.value)}
									placeholder={t('Enter your username')}
									tabIndex={3}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="memberEmail" className="text-sm font-medium">
									{t('Email address')}
								</Label>
								<Input
									id="memberEmail"
									name="memberEmail"
									type="text"
									autoComplete="email"
									value={formData.memberEmail}
									onChange={(e) => handleInput(e.target.name, e.target.value)}
									placeholder={t('Enter your email')}
									tabIndex={4}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="memberFullName" className="text-sm font-medium">
									{t('Full name')}
								</Label>
								<Input
									id="memberFullName"
									name="memberFullName"
									type="text"
									autoComplete="name"
									value={formData.memberFullName}
									onChange={(e) => handleInput(e.target.name, e.target.value)}
									placeholder={t('Enter your full name')}
									tabIndex={5}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="memberPassword" className="text-sm font-medium">
									{t('Password')}
								</Label>
								<div className="relative">
									<Input
										id="memberPassword"
										name="memberPassword"
										type={showPassword ? 'text' : 'password'}
										autoComplete="new-password"
										value={formData.memberPassword}
										onChange={(e) => handleInput(e.target.name, e.target.value)}
										placeholder={t('Enter your password')}
										className="pr-10"
										tabIndex={6}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
										tabIndex={-1}
									>
										{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
									</Button>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword" className="text-sm font-medium">
									{t('Confirm password')}
								</Label>
								<div className="relative">
									<Input
										id="confirmPassword"
										name="confirmPassword"
										type={showConfirmPassword ? 'text' : 'password'}
										autoComplete="new-password"
										value={formData.confirmPassword}
										onChange={(e) => handleInput(e.target.name, e.target.value)}
										placeholder={t('Confirm your password')}
										className="pr-10"
										tabIndex={7}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
										tabIndex={-1}
									>
										{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
									</Button>
								</div>
							</div>
						</div>

						<Button type="submit" className="w-full" disabled={isLoading} tabIndex={8}>
							{isLoading ? t('Creating account...') : t('Create account')}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default withAuthLayout(Signup);
