import { Card } from '@/libs/components/ui/card';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/libs/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/libs/components/ui/accordion';

const faqCategories = [
	{
		title: 'Getting Started',
		value: 'getting-started',
		questions: [
			{
				question: 'How do I create an account?',
				answer:
					'To create an account, click on the "Sign Up" button in the top right corner. You can sign up using your email address or through social media accounts like Google or Facebook.',
			},
			{
				question: 'How do I find events?',
				answer:
					'You can browse events by category, location, or date using our search and filter options. The homepage also shows featured and upcoming events based on your interests.',
			},
			{
				question: 'How do I purchase tickets?',
				answer:
					'Select the event you want to attend, choose your ticket type and quantity, then proceed to checkout. We accept various payment methods including credit cards and digital wallets.',
			},
			{
				question: 'What types of events are available?',
				answer:
					"We host a wide variety of events including concerts, conferences, workshops, sports events, and community gatherings. You can filter events by type, date, and location to find exactly what you're looking for.",
			},
			{
				question: "How do I save events I'm interested in?",
				answer:
					'You can save events by clicking the heart icon on any event card. Saved events will appear in your profile under "Saved Events" for easy access later.',
			},
		],
	},
	{
		title: 'Account & Profile',
		value: 'account-profile',
		questions: [
			{
				question: 'How do I update my profile information?',
				answer:
					'Go to your profile page and click the "Edit Profile" button. You can update your personal information, profile picture, and preferences there.',
			},
			{
				question: 'How do I change my password?',
				answer:
					'Navigate to Account Settings > Security. Click on "Change Password" and follow the instructions to set a new password.',
			},
			{
				question: 'How do I manage my notifications?',
				answer:
					'You can customize your notification preferences in Account Settings > Notifications. Choose which types of notifications you want to receive and how you want to receive them.',
			},
			{
				question: 'How do I connect my social media accounts?',
				answer:
					'In your profile settings, you can connect your social media accounts to share events with friends and import your profile information. This can be done under Account Settings > Social Connections.',
			},
			{
				question: 'How do I manage my privacy settings?',
				answer:
					"You can control your privacy settings in Account Settings > Privacy. Here you can manage who can see your profile, events you're attending, and other personal information.",
			},
		],
	},
	{
		title: 'Tickets & Events',
		value: 'tickets-events',
		questions: [
			{
				question: 'How do I transfer my ticket to someone else?',
				answer: `Go to your tickets section, select the ticket you want to transfer, and click "Transfer Ticket". Enter the recipient's email address and confirm the transfer.`,
			},
			{
				question: 'What is your refund policy?',
				answer:
					'Refund policies vary by event. You can check the specific refund policy for each event on the event details page. Generally, refunds are available up to 24 hours before the event.',
			},
			{
				question: 'How do I add an event to my calendar?',
				answer:
					'After purchasing a ticket, you\'ll receive an email with an "Add to Calendar" button. You can also find this option in your ticket details page.',
			},
			{
				question: 'What happens if an event is cancelled?',
				answer:
					'If an event is cancelled, you will be notified via email and all ticket holders will receive a full refund automatically. The refund will be processed to your original payment method.',
			},
			{
				question: 'How do I access my tickets?',
				answer:
					'Your tickets can be accessed through the "My Tickets" section in your profile. You can view, download, or transfer your tickets from there. Tickets are also sent to your email after purchase.',
			},
		],
	},
];

const helpResources = [
	{
		title: 'Contact Support',
		description: 'Need more help? Our support team is available 24/7.',
		link: '/contact',
		icon: '📞',
	},
	{
		title: 'Community Forum',
		description: 'Join our community to ask questions and share experiences.',
		link: '/forum',
		icon: '💬',
	},
	{
		title: 'Video Tutorials',
		description: 'Watch step-by-step guides on how to use our platform.',
		link: '/tutorials',
		icon: '🎥',
	},
];

const HelpPage = () => {
	return (
		<div className="container">
			<div className="text-center mb-16">
				<h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
				<p className="text-muted-foreground text-lg">
					Find answers to common questions or get in touch with our support team.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
				{helpResources.map((resource) => (
					<Card key={resource.title} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
						<div className="flex items-start space-x-4">
							<span className="text-3xl">{resource.icon}</span>
							<div>
								<h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
								<p className="text-muted-foreground text-sm">{resource.description}</p>
							</div>
						</div>
					</Card>
				))}
			</div>

			<Tabs defaultValue="getting-started" className="w-full">
				<TabsList className="grid w-full grid-cols-3 mb-8">
					{faqCategories.map((category) => (
						<TabsTrigger key={category.value} value={category.value} className="text-base font-medium">
							{category.title}
						</TabsTrigger>
					))}
				</TabsList>
				{faqCategories.map((category) => (
					<TabsContent key={category.value} value={category.value}>
						<Accordion type="single" collapsible className="w-full">
							{category.questions.map((faq, index) => (
								<AccordionItem key={faq.question} value={`item-${index}`}>
									<AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
									<AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
};

export default withBasicLayout(HelpPage);
