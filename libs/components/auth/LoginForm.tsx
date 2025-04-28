import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const LoginForm = () => {
	const router = useRouter();
	const [formData, setFormData] = useState({
		username: '',
		memberPassword: '',
	});
	const [errors, setErrors] = useState({
		username: '',
		memberPassword: '',
	});
	const [isLoading, setIsLoading] = useState(false);

	const validateForm = () => {
		const newErrors = {
			username: '',
			memberPassword: '',
		};
		let isValid = true;

		if (!formData.username.trim()) {
			newErrors.username = 'Username is required';
			isValid = false;
		}

		if (!formData.memberPassword) {
			newErrors.memberPassword = 'Password is required';
			isValid = false;
		} else if (formData.memberPassword.length < 6) {
			newErrors.memberPassword = 'Password must be at least 6 characters';
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear error when user starts typing
		if (errors[name as keyof typeof errors]) {
			setErrors((prev) => ({
				...prev,
				[name]: '',
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);
		try {
			// TODO: Implement actual login logic with API call
			console.log('Login attempt with:', formData);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Redirect to home page on successful login
			router.push('/');
		} catch (error) {
			console.error('Login failed:', error);
			setErrors((prev) => ({
				...prev,
				username: 'Invalid username or password',
			}));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
				<p className="mt-2 text-center text-sm text-gray-600">
					Or{' '}
					<Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
						create a new account
					</Link>
				</p>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<label htmlFor="username" className="block text-sm font-medium text-gray-700">
								Username
							</label>
							<div className="mt-1">
								<input
									id="username"
									name="username"
									type="text"
									autoComplete="username"
									required
									value={formData.username}
									onChange={handleChange}
									className={`appearance-none block w-full px-3 py-2 border ${
										errors.username ? 'border-red-300' : 'border-gray-300'
									} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
								/>
								{errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
							</div>
						</div>

						<div>
							<label htmlFor="memberPassword" className="block text-sm font-medium text-gray-700">
								Password
							</label>
							<div className="mt-1">
								<input
									id="memberPassword"
									name="memberPassword"
									type="password"
									autoComplete="current-password"
									required
									value={formData.memberPassword}
									onChange={handleChange}
									className={`appearance-none block w-full px-3 py-2 border ${
										errors.memberPassword ? 'border-red-300' : 'border-gray-300'
									} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
								/>
								{errors.memberPassword && <p className="mt-1 text-sm text-red-600">{errors.memberPassword}</p>}
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
								/>
								<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
									Remember me
								</label>
							</div>

							<div className="text-sm">
								<Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
									Forgot your password?
								</Link>
							</div>
						</div>

						<div>
							<button
								type="submit"
								disabled={isLoading}
								className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
									isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
								} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
							>
								{isLoading ? 'Signing in...' : 'Sign in'}
							</button>
						</div>
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">Or continue with</span>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-2 gap-3">
							<button
								type="button"
								className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
							>
								<span className="sr-only">Sign in with Google</span>
								<svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.028-2.507 1.577-4.053 1.577-3.06 0-5.573-2.5-5.573-5.573 0-3.073 2.513-5.573 5.573-5.573 1.546 0 2.906.55 4.053 1.577l2.853-2.853C17.44 5.39 15.12 4.5 12.48 4.5c-4.4 0-8 3.6-8 8s3.6 8 8 8c4.4 0 8-3.6 8-8 0-.52-.06-1.02-.16-1.5H12.48z" />
								</svg>
							</button>
							<button
								type="button"
								className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
							>
								<span className="sr-only">Sign in with GitHub</span>
								<svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
