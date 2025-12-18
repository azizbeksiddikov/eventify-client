import Link from "next/link";
import { Instagram, Linkedin, MapPin, Phone, Clock, Send } from "lucide-react";

import { Logo } from "@/libs/components/common/Logo";

const quickLinks = [
	{ href: "/events", label: "Events" },
	{ href: "/groups", label: "Groups" },
	{ href: "/organizers", label: "Organizers" },
	{ href: "/help", label: "Help Center" },
];

const Footer = () => {
	return (
		<footer className="bg-background border-t w-full text-sm md:text-base">
			<div className="content-container my-8 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
				{/* Company Info & Social */}
				<div className="space-y-6 md:space-y-8">
					<Link href="/" className="flex items-center gap-3 hover:scale-95 transition-transform">
						<Logo className="h-8 w-8" />
						<span className="text-xl font-bold">Eventify</span>
					</Link>
					<p className="leading-6 text-muted-foreground md:leading-7">
						{"Discover and create amazing events. Connect with people who share your interests and passions."}
					</p>
					<div className="flex flex-wrap items-center gap-2 md:gap-4">
						<Link
							href="https://instagram.com/siddikov_aziz"
							target="_blank"
							className="p-2 md:p-3 rounded-full bg-background/50 hover:bg-primary transition-all hover:scale-110 border border-border/20"
						>
							<Instagram className="w-4 h-4 md:w-5 md:h-5" />
						</Link>
						<Link
							href="https://linkedin.com/in/azbek"
							target="_blank"
							className="p-2 md:p-3 rounded-full bg-background/50 hover:bg-primary transition-all hover:scale-110 border border-border/20"
						>
							<Linkedin className="w-4 h-4 md:w-5 md:h-5" />
						</Link>
						<Link
							href="https://t.me/siddikov_a"
							target="_blank"
							className="p-2 md:p-3 rounded-full bg-background/50 hover:bg-primary transition-all hover:scale-110 border border-border/20"
						>
							<Send className="w-4 h-4 md:w-5 md:h-5" />
						</Link>
					</div>
				</div>

				{/* Quick Links */}
				<div className="space-y-6 md:space-y-8">
					<h3 className="text-lg font-medium sm:text-xl">{"Quick Links"}</h3>
					<ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-1 md:space-y-4 md:block">
						{quickLinks.map((link, index) => (
							<li key={index}>
								<Link
									href={link.href}
									className="flex items-center hover:text-primary transition-colors group group-hover:gap-6 text-sm md:text-base"
								>
									<span className="w-2 h-2 rounded-full bg-primary hidden group-hover:block" />
									<span className="group-hover:translate-x-2 transition-transform">{link.label}</span>
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Contact Info */}
				<div className="space-y-6 md:space-y-8">
					<h3 className="text-lg font-medium sm:text-xl">{"Contact Us"}</h3>
					<div className="space-y-5 md:space-y-6">
						<div className="flex items-center gap-4">
							<MapPin className="w-5 h-5 text-primary shrink-0" />
							<p className="text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
								{"Gangnam-gu, Seoul South Korea"}
							</p>
						</div>
						<div className="flex items-center gap-4">
							<Phone className="w-5 h-5 text-primary shrink-0" />
							<p className="text-sm leading-6 text-muted-foreground md:text-base md:leading-7">010-7305-6799</p>
						</div>
						<div className="flex items-center gap-4">
							<Clock className="w-5 h-5 text-primary shrink-0" />
							<p className="text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
								{"Mon-Fri: 9:00 AM - 6:00 PM"}
							</p>
						</div>
					</div>
				</div>
			</div>

			<hr className="border-t" />
			{/* Bottom Bar */}
			<div className="content-container mt-4 mb-12">
				<div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
					<p className="text-sm text-muted-foreground md:text-base">© {"2025 Eventify. All rights reserved"}.</p>
					<div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-muted-foreground md:text-base">
						<p>{"Privacy Policy"}</p>
						<p>{"Terms of Service"}</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
