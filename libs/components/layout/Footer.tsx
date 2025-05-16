import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Instagram, Linkedin, MapPin, Phone, Clock, Send } from 'lucide-react';

import { Logo } from '@/libs/components/ui/logo';
import { cn } from '@/libs/utils';

const quickLinks = [
	{ href: '/event', label: 'Events' },
	{ href: '/group', label: 'Groups' },
	{ href: '/organizer', label: 'Organizers' },
	{ href: '/help', label: 'Help Center' },
];

const Footer = () => {
	const { t } = useTranslation();

	return (
		<footer className="w-full bg-foreground/95 backdrop-blur-sm ">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
					{/* Company Info & Social */}
					<div className="pt-8 space-y-6">
						<Link href="/" className="flex items-center gap-3 hover:scale-95 transition-transform duration-300">
							<Logo className="h-8 w-8 text-background" />
							<span className="text-xl font-semibold text-background">Eventify</span>
						</Link>
						<p className="text-body text-background leading-relaxed max-w-md">
							{t('Discover and create amazing events. Connect with people who share your interests and passions.')}
						</p>
						<div className="flex items-center gap-4">
							<Link
								href="https://instagram.com/siddikov_aziz"
								target="_blank"
								className={cn(
									'p-3 rounded-full bg-background/50 hover:bg-primary hover:text-background transition-all duration-300 hover:scale-110 border border-border/20',
								)}
							>
								<Instagram className="w-5 h-5" />
							</Link>
							<Link
								href="https://linkedin.com/in/azbek"
								target="_blank"
								className={cn(
									'p-3 rounded-full bg-background/50 hover:bg-primary hover:text-background transition-all duration-300 hover:scale-110 border border-border/20',
								)}
							>
								<Linkedin className="w-5 h-5" />
							</Link>
							<Link
								href="https://t.me/siddikov_a"
								target="_blank"
								className={cn(
									'p-3 rounded-full bg-background/50 hover:bg-primary hover:text-background transition-all duration-300 hover:scale-110 border border-border/20',
								)}
							>
								<Send className="w-5 h-5" />
							</Link>
						</div>
					</div>

					{/* Quick Links */}
					<div className="pt-8">
						<h3 className="text-h1 font-semibold text-background mb-6">{t('Quick Links')}</h3>
						<ul className="space-y-4">
							{quickLinks.map((link, index) => (
								<li key={index}>
									<Link
										href={link.href}
										className="flex items-center gap-3 text-background hover:text-primary transition-colors duration-300 group"
									>
										<span className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
										<span className="text-body group-hover:translate-x-1 transition-transform duration-300">
											{link.label}
										</span>
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact Info */}
					<div className="pt-8">
						<h3 className="text-h1 font-semibold text-background mb-6">{t('Contact Us')}</h3>
						<div className="space-y-6">
							<div className="flex items-start gap-4">
								<MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
								<p className="text-body text-background leading-relaxed">{t('Gangnam-gu, Seoul South Korea')}</p>
							</div>
							<div className="flex items-center gap-4">
								<Phone className="w-5 h-5 text-primary flex-shrink-0" />
								<div className="text-body text-background">010-7305-6799</div>
							</div>
							<div className="flex items-center gap-4">
								<Clock className="w-5 h-5 text-primary flex-shrink-0" />
								<p className="text-body text-background">{t('Mon-Fri: 9:00 AM - 6:00 PM')}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-16 pt-8 border-t  border-background/20">
					<div className="flex flex-col md:flex-row justify-between items-center gap-6">
						<p className="text-sm text-background">© {t('2025 Eventify. All rights reserved')}.</p>
						<div className="flex items-center gap-8">
							<div className="text-sm text-background transition-colors">{t('Privacy Policy')}</div>
							<div className="text-sm text-background transition-colors">{t('Terms of Service')}</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
