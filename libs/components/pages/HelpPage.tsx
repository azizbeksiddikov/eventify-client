import { useState } from 'react';
import Link from 'next/link';

const HelpPage = () => {
	const [activeSection, setActiveSection] = useState('navigation');

	const faqs = [
		{
			question: 'How do I create an event?',
			answer:
				'To create an event, go to the Events page and click the "Create Event" button. Fill in the required details and submit the form.',
		},
		{
			question: 'How can I join a group?',
			answer:
				'Visit the Groups page, find a group you\'re interested in, and click the "Join Group" button on the group\'s page.',
		},
		{
			question: 'How do I purchase tickets?',
			answer: 'Navigate to the event you want to attend, select the number of tickets, and proceed to checkout.',
		},
		{
			question: 'Can I cancel my ticket?',
			answer:
				'Yes, you can cancel your ticket up to 24 hours before the event. Visit the "My Tickets" page to manage your tickets.',
		},
	];

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="text-center">
				<h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Help Center</h1>
				<p className="mt-3 text-xl text-gray-500 sm:mt-4">
					Find answers to your questions and get in touch with our support team
				</p>
			</div>

			<div className="mt-12">
				<div className="flex flex-col sm:flex-row gap-4 mb-8">
					<button
						onClick={() => setActiveSection('navigation')}
						className={`px-4 py-2 rounded-md ${
							activeSection === 'navigation'
								? 'bg-indigo-600 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Navigation Guide
					</button>
					<button
						onClick={() => setActiveSection('faq')}
						className={`px-4 py-2 rounded-md ${
							activeSection === 'faq' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Frequently Asked Questions
					</button>
					<button
						onClick={() => setActiveSection('contact')}
						className={`px-4 py-2 rounded-md ${
							activeSection === 'contact' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Contact Us
					</button>
				</div>

				{activeSection === 'navigation' && (
					<div className="bg-white shadow rounded-lg p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">Navigation Guide</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">Main Pages</h3>
								<ul className="space-y-2">
									<li>
										<Link href="/" className="text-indigo-600 hover:text-indigo-500">
											Home
										</Link>
										- Discover featured events and groups
									</li>
									<li>
										<Link href="/events" className="text-indigo-600 hover:text-indigo-500">
											Events
										</Link>
										- Browse and create events
									</li>
									<li>
										<Link href="/groups" className="text-indigo-600 hover:text-indigo-500">
											Groups
										</Link>
										- Find and join interest groups
									</li>
									<li>
										<Link href="/tickets" className="text-indigo-600 hover:text-indigo-500">
											My Tickets
										</Link>
										- Manage your event tickets
									</li>
								</ul>
							</div>
							<div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">User Features</h3>
								<ul className="space-y-2">
									<li>
										<Link href="/myPage" className="text-indigo-600 hover:text-indigo-500">
											My Page
										</Link>
										- Manage your profile and settings
									</li>
									<li>
										<Link href="/create-event" className="text-indigo-600 hover:text-indigo-500">
											Create Event
										</Link>
										- Start organizing your own events
									</li>
									<li>
										<Link href="/create-group" className="text-indigo-600 hover:text-indigo-500">
											Create Group
										</Link>
										- Start your own interest group
									</li>
								</ul>
							</div>
						</div>
					</div>
				)}

				{activeSection === 'faq' && (
					<div className="bg-white shadow rounded-lg p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
						<div className="space-y-6">
							{faqs.map((faq, index) => (
								<div key={index} className="border-b border-gray-200 pb-6">
									<h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
									<p className="mt-2 text-gray-500">{faq.answer}</p>
								</div>
							))}
						</div>
					</div>
				)}

				{activeSection === 'contact' && (
					<div className="bg-white shadow rounded-lg p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">Support Channels</h3>
								<ul className="space-y-2">
									<li className="flex items-center">
										<svg
											className="h-5 w-5 text-gray-400 mr-2"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
											<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
										</svg>
										Email: support@eventify.com
									</li>
									<li className="flex items-center">
										<svg
											className="h-5 w-5 text-gray-400 mr-2"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
										</svg>
										Phone: +1 (555) 123-4567
									</li>
								</ul>
							</div>
							<div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">Business Hours</h3>
								<p className="text-gray-500">
									Monday - Friday: 9:00 AM - 6:00 PM (GMT)
									<br />
									Saturday - Sunday: 10:00 AM - 4:00 PM (GMT)
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default HelpPage;
