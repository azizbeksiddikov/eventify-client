import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MemberType } from '../../enums/member.enum';

const SignupForm = () => {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		firstName: '',
		lastName: '',
		phoneNumber: '',
		memberType: MemberType.USER,
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};
		if (!formData.email) newErrors.email = 'Email is required';
		else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
		if (!formData.password) newErrors.password = 'Password is required';
		else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
		if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
		if (!formData.firstName) newErrors.firstName = 'First name is required';
		if (!formData.lastName) newErrors.lastName = 'Last name is required';
		if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Store user data in localStorage
			localStorage.setItem(
				'user',
				JSON.stringify({
					email: formData.email,
					memberType: formData.memberType,
					firstName: formData.firstName,
					lastName: formData.lastName,
				}),
			);

			router.push('/');
		} catch (error) {
			setErrors({ submit: 'An error occurred during signup' });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Or{' '}
						<a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
							sign in to your account
						</a>
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="memberType" className="block text-sm font-medium text-gray-700 mb-1">
								Account Type
							</label>
							<select
								id="memberType"
								name="memberType"
								value={formData.memberType}
								onChange={handleChange}
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							>
								<option value={MemberType.USER}>User</option>
								<option value={MemberType.ORGANIZER}>Organizer</option>
							</select>
						</div>
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={formData.email}
								onChange={handleChange}
								className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
									errors.email ? 'border-red-300' : 'border-gray-300'
								} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
								placeholder="Email address"
							/>
							{errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
						</div>
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="new-password"
								required
								value={formData.password}
								onChange={handleChange}
								className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
									errors.password ? 'border-red-300' : 'border-gray-300'
								} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
								placeholder="Password"
							/>
							{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
						</div>
						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
								Confirm Password
							</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								autoComplete="new-password"
								required
								value={formData.confirmPassword}
								onChange={handleChange}
								className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
									errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
								} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
								placeholder="Confirm Password"
							/>
							{errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
						</div>
						<div>
							<label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
								First Name
							</label>
							<input
								id="firstName"
								name="firstName"
								type="text"
								required
								value={formData.firstName}
								onChange={handleChange}
								className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
									errors.firstName ? 'border-red-300' : 'border-gray-300'
								} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
								placeholder="First Name"
							/>
							{errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
						</div>
						<div>
							<label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
								Last Name
							</label>
							<input
								id="lastName"
								name="lastName"
								type="text"
								required
								value={formData.lastName}
								onChange={handleChange}
								className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
									errors.lastName ? 'border-red-300' : 'border-gray-300'
								} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
								placeholder="Last Name"
							/>
							{errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
						</div>
						<div>
							<label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
								Phone Number
							</label>
							<input
								id="phoneNumber"
								name="phoneNumber"
								type="tel"
								required
								value={formData.phoneNumber}
								onChange={handleChange}
								className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
									errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
								} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
								placeholder="Phone Number"
							/>
							{errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
						</div>
					</div>

					{errors.submit && <p className="text-sm text-red-600 text-center">{errors.submit}</p>}

					<div>
						<button
							type="submit"
							disabled={isLoading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? 'Signing up...' : 'Sign up'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignupForm;
