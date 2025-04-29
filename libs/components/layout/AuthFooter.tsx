import Link from 'next/link';

const AuthFooter = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="w-full bg-white/95 backdrop-blur-sm border-t border-gray-200/50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex flex-col md:flex-row justify-between items-center gap-6">
					<p className="text-sm text-gray-600">© {currentYear} Eventify. All rights reserved.</p>
					<div className="flex items-center gap-8">
						<Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300">
							Privacy Policy
						</Link>
						<Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300">
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default AuthFooter;
