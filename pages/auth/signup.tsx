import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MemberInput } from '@/libs/types/member/member.input';
import withAuthLayout from '@/libs/components/layout/LayoutAuth';
import { Eye, EyeOff } from 'lucide-react';

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
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};
		let isValid = true;

		if (!formData.username.trim()) {
			newErrors.username = 'Username is required';
			isValid = false;
		}

		if (!formData.memberEmail.trim()) {
			newErrors.memberEmail = 'Email is required';
			isValid = false;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.memberEmail)) {
			newErrors.memberEmail = 'Please enter a valid email address';
			isValid = false;
		}

		if (!formData.memberFullName.trim()) {
			newErrors.memberFullName = 'Full name is required';
			isValid = false;
		}

		if (!formData.memberPassword) {
			newErrors.memberPassword = 'Password is required';
			isValid = false;
		} else if (formData.memberPassword.length < 8) {
			newErrors.memberPassword = 'Password must be at least 8 characters';
			isValid = false;
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = 'Please confirm your password';
			isValid = false;
		} else if (formData.confirmPassword !== formData.memberPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
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
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: '',
			}));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			setIsLoading(true);
			setTimeout(() => {
				setIsLoading(false);
				router.push('/');
			}, 1000);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8 bg-white rounded-2xl shadow-sm p-8">
				<div className="text-center">
					<h2 className="text-3xl font-semibold text-gray-900">Create your account</h2>
					<p className="mt-2 text-sm text-gray-600">
						Or{' '}
						<Link
							href="auth/login"
							className="font-medium text-gray-900 hover:text-gray-700 transition-colors duration-300 underline"
						>
							sign in to your account
						</Link>
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4">
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
									className={`appearance-none block w-full px-4 py-3 border ${
										errors.username ? 'border-red-300' : 'border-gray-300'
									} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm transition-colors duration-300`}
									placeholder="Enter your username"
								/>
								{errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
							</div>
						</div>

						<div>
							<label htmlFor="memberEmail" className="block text-sm font-medium text-gray-700">
								Email address
							</label>
							<div className="mt-1">
								<input
									id="memberEmail"
									name="memberEmail"
									type="email"
									autoComplete="email"
									required
									value={formData.memberEmail}
									onChange={handleChange}
									className={`appearance-none block w-full px-4 py-3 border ${
										errors.memberEmail ? 'border-red-300' : 'border-gray-300'
									} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm transition-colors duration-300`}
									placeholder="Enter your email"
								/>
								{errors.memberEmail && <p className="mt-1 text-sm text-red-600">{errors.memberEmail}</p>}
							</div>
						</div>

						<div>
							<label htmlFor="memberFullName" className="block text-sm font-medium text-gray-700">
								Full name
							</label>
							<div className="mt-1">
								<input
									id="memberFullName"
									name="memberFullName"
									type="text"
									autoComplete="name"
									required
									value={formData.memberFullName}
									onChange={handleChange}
									className={`appearance-none block w-full px-4 py-3 border ${
										errors.memberFullName ? 'border-red-300' : 'border-gray-300'
									} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm transition-colors duration-300`}
									placeholder="Enter your full name"
								/>
								{errors.memberFullName && <p className="mt-1 text-sm text-red-600">{errors.memberFullName}</p>}
							</div>
						</div>

						<div>
							<label htmlFor="memberPassword" className="block text-sm font-medium text-gray-700">
								Password
							</label>
							<div className="mt-1 relative">
								<input
									id="memberPassword"
									name="memberPassword"
									type={showPassword ? 'text' : 'password'}
									autoComplete="new-password"
									required
									value={formData.memberPassword}
									onChange={handleChange}
									className={`appearance-none block w-full px-4 py-3 border ${
										errors.memberPassword ? 'border-red-300' : 'border-gray-300'
									} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm transition-colors duration-300 pr-10`}
									placeholder="Enter your password"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
								>
									{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
								</button>
								{errors.memberPassword && <p className="mt-1 text-sm text-red-600">{errors.memberPassword}</p>}
							</div>
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
								Confirm password
							</label>
							<div className="mt-1 relative">
								<input
									id="confirmPassword"
									name="confirmPassword"
									type={showConfirmPassword ? 'text' : 'password'}
									autoComplete="new-password"
									required
									value={formData.confirmPassword}
									onChange={handleChange}
									className={`appearance-none block w-full px-4 py-3 border ${
										errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
									} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm transition-colors duration-300 pr-10`}
									placeholder="Confirm your password"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
								>
									{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
								</button>
								{errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
							</div>
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={isLoading}
							className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
								isLoading ? 'bg-gray-400' : 'bg-gray-900 hover:bg-gray-800'
							} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300`}
						>
							{isLoading ? 'Creating account...' : 'Create account'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default withAuthLayout(Signup);
