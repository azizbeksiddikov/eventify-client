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
		<footer className="bg-background border-t w-full">
			<div className="content-container my-8 grid grid-cols-3 gap-12">
				{/* Company Info & Social */}
				<div className="space-y-8">
					<Link href="/" className="flex items-center gap-3 hover:scale-95 transition-transform">
						<Logo className="h-8 w-8" />
						<span className="text-xl font-bold">Eventify</span>
					</Link>
					<p>{"Discover and create amazing events. Connect with people who share your interests and passions."}</p>
					<div className="flex items-center gap-2 md:gap-4">
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
				<div className="space-y-8">
					<h3 className="text-xl font-medium">{"Quick Links"}</h3>
					<ul className="space-y-4">
						{quickLinks.map((link, index) => (
							<li key={index}>
								<Link
									href={link.href}
									className="flex items-center hover:text-primary transition-colors group group-hover:gap-6"
								>
									<span className="w-2 h-2 rounded-full bg-primary hidden group-hover:block" />
									<span className="group-hover:translate-x-2 transition-transform">{link.label}</span>
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Contact Info */}
				<div className="space-y-8">
					<h3 className="text-xl font-medium">{"Contact Us"}</h3>
					<div className="space-y-6">
						<div className="flex items-center gap-4">
							<MapPin className="w-5 h-5 text-primary shrink-0" />
							<p>{"Gangnam-gu, Seoul South Korea"}</p>
						</div>
						<div className="flex items-center gap-4">
							<Phone className="w-5 h-5 text-primary shrink-0" />
							<p>010-7305-6799</p>
						</div>
						<div className="flex items-center gap-4">
							<Clock className="w-5 h-5 text-primary shrink-0" />
							<p>{"Mon-Fri: 9:00 AM - 6:00 PM"}</p>
						</div>
					</div>
				</div>
			</div>

			<hr className="border-t" />
			{/* Bottom Bar */}
			<div className="content-container mt-4 mb-12">
				<div className="flex flex-row justify-between items-center gap-6">
					<p>© {"2025 Eventify. All rights reserved"}.</p>
					<div className="flex items-center gap-8">
						<p>{"Privacy Policy"}</p>
						<p>{"Terms of Service"}</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
