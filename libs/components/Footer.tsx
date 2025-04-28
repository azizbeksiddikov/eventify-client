import React from 'react';

const Footer = () => {
	return (
		<footer className="bg-gray-50">
			<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div>
						<h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">About</h3>
						<p className="mt-4 text-base text-gray-500">
							Evently is your go-to platform for discovering and joining exciting events in your community.
						</p>
					</div>
					<div>
						<h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Quick Links</h3>
						<ul className="mt-4 space-y-4">
							<li>
								<a href="/groups" className="text-base text-gray-500 hover:text-gray-900">
									Groups
								</a>
							</li>
							<li>
								<a href="/events" className="text-base text-gray-500 hover:text-gray-900">
									Events
								</a>
							</li>
							<li>
								<a href="/tickets" className="text-base text-gray-500 hover:text-gray-900">
									My Tickets
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contact</h3>
						<ul className="mt-4 space-y-4">
							<li>
								<a href="mailto:contact@evently.com" className="text-base text-gray-500 hover:text-gray-900">
									contact@evently.com
								</a>
							</li>
							<li>
								<a href="#" className="text-base text-gray-500 hover:text-gray-900">
									Privacy Policy
								</a>
							</li>
							<li>
								<a href="#" className="text-base text-gray-500 hover:text-gray-900">
									Terms of Service
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="mt-8 border-t border-gray-200 pt-8">
					<p className="text-base text-gray-400 text-center">
						&copy; {new Date().getFullYear()} Evently. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
