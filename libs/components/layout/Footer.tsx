import Link from 'next/link';
import { Instagram, Linkedin, MapPin, Phone, Clock } from 'lucide-react';

const Footer = () => {
	return (
		<footer className="w-full bg-background/95 backdrop-blur-sm border-t border-border/50">
			<div className="container mx-auto px-6 py-16">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-16">
					{/* Company Info & Social */}
					<div className="pt-8 space-y-6">
						<Link href="/" className="flex items-center gap-3 group">
							<img
								src="/images/logo.png"
								alt="Eventify Logo"
								className="w-12 h-12 group-hover:scale-105 transition-transform duration-300"
							/>
							<span className="text-h1 font-bold text-foreground group-hover:text-primary transition-colors duration-300">
								Eventify
							</span>
						</Link>
						<p className="text-body text-muted-foreground leading-relaxed max-w-md">
							Discover and create amazing events. Connect with people who share your interests and passions.
						</p>
						<div className="flex items-center gap-4">
							<Link
								href="https://instagram.com/siddikov_a"
								target="_blank"
								className="p-3 rounded-full bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
							>
								<Instagram className="w-6 h-6" />
							</Link>
							<Link
								href="https://linkedin.com/in/azz4"
								target="_blank"
								className="p-3 rounded-full bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
							>
								<Linkedin className="w-6 h-6" />
							</Link>
						</div>
					</div>

					{/* Quick Links */}
					<div className="pt-8">
						<h3 className="text-h1 font-semibold text-foreground mb-8">Quick Links</h3>
						<ul className="space-y-4">
							<li>
								<Link
									href="/events"
									className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-300 group"
								>
									<span className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									<span className="text-body group-hover:translate-x-1 transition-transform duration-300">Events</span>
								</Link>
							</li>
							<li>
								<Link
									href="/groups"
									className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-300 group"
								>
									<span className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									<span className="text-body group-hover:translate-x-1 transition-transform duration-300">Groups</span>
								</Link>
							</li>
							<li>
								<Link
									href="/organizers"
									className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-300 group"
								>
									<span className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									<span className="text-body group-hover:translate-x-1 transition-transform duration-300">
										Organizers
									</span>
								</Link>
							</li>
							<li>
								<Link
									href="/help"
									className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-300 group"
								>
									<span className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									<span className="text-body group-hover:translate-x-1 transition-transform duration-300">
										Help Center
									</span>
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div className="pt-8">
						<h3 className="text-h1 font-semibold text-foreground mb-8">Contact Us</h3>
						<div className="space-y-6">
							<div className="flex items-start gap-4">
								<MapPin className="w-6 h-6 text-primary mt-1" />
								<p className="text-body text-muted-foreground leading-relaxed">
									Gangnam-gu, Seoul
									<br />
									South Korea
								</p>
							</div>
							<div className="flex items-center gap-4">
								<Phone className="w-6 h-6 text-primary" />
								<a
									href="tel:010-7305-6799"
									className="text-body text-muted-foreground hover:text-primary transition-colors duration-300"
								>
									010-7305-6799
								</a>
							</div>
							<div className="flex items-center gap-4">
								<Clock className="w-6 h-6 text-primary" />
								<p className="text-body text-muted-foreground">Mon-Fri: 9:00 AM - 6:00 PM</p>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-16 pt-8 pb-8 border-t border-border/50">
					<div className="flex flex-col md:flex-row justify-between items-center gap-8">
						<p className="text-body text-muted-foreground">© 2025 Eventify. All rights reserved.</p>
						<div className="flex items-center gap-8">
							<Link
								href="/privacy"
								className="text-body text-muted-foreground hover:text-primary transition-colors duration-300"
							>
								Privacy Policy
							</Link>
							<Link
								href="/terms"
								className="text-body text-muted-foreground hover:text-primary transition-colors duration-300"
							>
								Terms of Service
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
