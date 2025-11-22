import Link from "next/link";
import { useTranslation } from "next-i18next";
import { Instagram, Linkedin, MapPin, Phone, Clock, Send } from "lucide-react";

import { Logo } from "@/libs/components/common/Logo";
import { cn } from "@/libs/utils";

const MobileFooter = () => {
	const { t } = useTranslation();

	return (
		<footer className="w-full bg-foreground/95 backdrop-blur-sm">
			<div className="container mx-auto px-4 py-8 md:py-16">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
					{/* Company Info & Social */}
					<div className="space-y-4 md:space-y-6">
						<Link href="/" className="flex items-center gap-3 hover:scale-95 transition-transform duration-300">
							<Logo className="h-8 w-8 text-background" />
							<span className="text-xl font-semibold text-background">Eventify</span>
						</Link>
						<p className="text-sm md:text-body text-background leading-relaxed max-w-md">
							{t("Discover and create amazing events. Connect with people who share your interests and passions.")}
						</p>
						<div className="flex items-center gap-3">
							<Link
								href="https://instagram.com/siddikov_aziz"
								target="_blank"
								className={cn(
									"p-2 md:p-3 rounded-full bg-background/50 hover:bg-primary hover:text-background transition-all duration-300 hover:scale-110 border  /20",
								)}
							>
								<Instagram className="w-4 h-4 md:w-5 md:h-5" />
							</Link>
							<Link
								href="https://linkedin.com/in/azbek"
								target="_blank"
								className={cn(
									"p-2 md:p-3 rounded-full bg-background/50 hover:bg-primary hover:text-background transition-all duration-300 hover:scale-110 border  /20",
								)}
							>
								<Linkedin className="w-4 h-4 md:w-5 md:h-5" />
							</Link>
							<Link
								href="https://t.me/siddikov_a"
								target="_blank"
								className={cn(
									"p-2 md:p-3 rounded-full bg-background/50 hover:bg-primary hover:text-background transition-all duration-300 hover:scale-110 border  /20",
								)}
							>
								<Send className="w-4 h-4 md:w-5 md:h-5" />
							</Link>
						</div>
					</div>

					{/* Contact Info */}
					<div className="space-y-4 md:space-y-6 ">
						<h3 className="text-lg md:text-h1 font-semibold text-background">{t("Contact Us")}</h3>
						<div className="space-y-4 md:space-y-6">
							<div className="flex items-center gap-3">
								<MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
								<p className="text-sm md:text-body text-background w-full ">{t("Gangnam-gu, Seoul South Korea")}</p>
							</div>
							<div className="flex items-center gap-3">
								<Phone className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
								<div className="text-sm md:text-body text-background">010-7305-6799</div>
							</div>
							<div className="flex items-center gap-3">
								<Clock className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
								<p className="text-sm md:text-body text-background">{t("Mon-Fri: 9:00 AM - 6:00 PM")}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-8 md:mt-16 pt-6 md:pt-8 border-t border-background/20">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<p className="text-xs md:text-sm text-background text-center">
							© 2025 Eventify. {t("All rights reserved")}.
						</p>
						<div className="flex items-center justify-around m-0  w-full">
							<Link href="/privacy" className="text-xs md:text-sm text-background hover:text-primary transition-colors">
								{t("Privacy Policy")}
							</Link>
							<Link href="/terms" className="text-xs md:text-sm text-background hover:text-primary transition-colors">
								{t("Terms of Service")}
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default MobileFooter;
