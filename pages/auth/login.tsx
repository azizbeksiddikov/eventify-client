import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Eye, EyeOff } from 'lucide-react';
import { Toaster } from 'sonner';

import { LoginInput } from '@/libs/types/member/member.input';
import { logIn } from '@/libs/auth';
import { Message } from '@/libs/enums/common.enum';
import withAuthLayout from '@/libs/components/layout/LayoutAuth';
import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { smallError } from '@/libs/alert';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Login = () => {
	const router = useRouter();
	const [loginInput, setLoginInput] = useState<LoginInput>({
		username: '',
		memberPassword: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	/** HANDLERS **/
	const handleInput = useCallback((name: string, value: string) => {
		setLoginInput((prev) => ({
			...prev,
			[name]: value,
		}));
	}, []);

	const validateForm = () => {
		if (!loginInput.username.trim()) {
			smallError(Message.USERNAME_REQUIRED);
			return false;
		}
		if (!loginInput.memberPassword) {
			smallError(Message.PASSWORD_REQUIRED);
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
				await logIn(loginInput.username, loginInput.memberPassword);
				await router.push(`${router.query.referrer ?? '/'}`);
			} catch (err: unknown) {
				const error = err as Error;
				smallError(error.message);
			} finally {
				setIsLoading(false);
			}
		},
		[loginInput, router],
	);

	return (
		<>
			<Toaster position="top-right" richColors visibleToasts={1} />
			<div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 sm:px-6 lg:px-8">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<CardTitle className="text-3xl font-semibold">Login</CardTitle>
						<CardDescription>
							Or{' '}
							<Link
								href="/auth/signup"
								className="font-medium text-primary hover:text-primary/80 transition-colors duration-300 underline"
							>
								create a new account
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
										value={loginInput.username}
										onChange={(e) => handleInput(e.target.name, e.target.value)}
										placeholder="Enter your username"
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
											autoComplete="current-password"
											value={loginInput.memberPassword}
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
							</div>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? 'Signing in...' : 'Sign in'}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default withAuthLayout(Login);
