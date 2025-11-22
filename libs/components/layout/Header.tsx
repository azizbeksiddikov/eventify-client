"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReactiveVar } from "@apollo/client/react";

import { Button, buttonVariants } from "@/libs/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/libs/components/ui/dropdown-menu";
import { ModeToggle } from "@/libs/components/ui/mode-toggle";
// import { ModeToggle } from "@/libs/components/layout/ModeToggle";
import { Languages } from "lucide-react";
import { Logo } from "@/libs/components/common/Logo";
import { UserNav } from "@/libs/components/layout/UserNav";
import { NotificationDropdown } from "@/libs/components/layout/NotificationDropdown";

import { cn } from "@/libs/utils";
import { userVar } from "@/apollo/store";
import { getValidJwtToken, updateUserInfo } from "@/libs/auth";
import { Member } from "@/libs/types/member/member";
import { MemberType } from "@/libs/enums/member.enum";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/event", label: "Events" },
	{ href: "/group", label: "Groups" },
	{ href: "/organizer", label: "Organizers" },
	{ href: "/help", label: "Help" },
];
const adminLink = { href: "/_admin", label: "Admin" };

const Header = () => {
	const pathname = usePathname();
	const authMember = useReactiveVar(userVar) as unknown as Member;
	const router = useRouter();
	const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
		// Initialize from localStorage only on client-side
		if (typeof window !== "undefined") {
			const locale = localStorage.getItem("locale");
			if (!locale) {
				localStorage.setItem("locale", "en");
				return "en";
			}
			return locale;
		}
		return "en";
	});

	const languages = [
		{ code: "en", name: "English", flag: "🇺🇸" },
		{ code: "ru", name: "Russian", flag: "🇷🇺" },
		{ code: "uz", name: "Uzbek", flag: "🇺🇿" },
		{ code: "ko", name: "Korean", flag: "🇰🇷" },
	];

	/** LIFECYCLES **/

	// Update user info on mount - only if token is valid and not expired
	useEffect(() => {
		const jwt = getValidJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	/** HANDLERS **/
	const languageHandler = useCallback(
		(languageCode: string) => {
			setCurrentLanguage(languageCode);
			localStorage.setItem("locale", languageCode);
			// Refresh the page to apply the new locale
			router.refresh();
		},
		[router],
	);

	return (
		<header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b ">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-3 hover:scale-95 transition-transform duration-300">
					<Logo className="h-8 w-8" />
					<span className="text-xl font-semibold text-foreground">Eventify</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className="flex items-center gap-8 ">
					{navLinks.map((link, index) => (
						<Link
							key={index}
							href={link.href}
							className={`text-sm font-medium transition-colors duration-300 ${
								pathname === link.href
									? "text-foneground font-semibold underline underline-offset-6"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							{`${link.label}`}
						</Link>
					))}
					{authMember.memberType === MemberType.ADMIN && (
						<Link
							href={adminLink.href}
							className={`text-sm font-medium transition-colors duration-300 ${
								pathname === adminLink.href
									? "text-foneground font-semibold underline underline-offset-6"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							{`${adminLink.label}`}
						</Link>
					)}
				</nav>

				{/* Auth & Lang & Theme */}
				<div className="flex items-center gap-3">
					{/* Notification */}
					{authMember._id && <NotificationDropdown />}

					{/* Theme Mode Switcher */}
					<ModeToggle />

					{/* Language Selector */}
					<DropdownMenu>
						<DropdownMenuTrigger
							className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "offdet-0 h-10 w-10")}
						>
							<Languages className="h-5 w-5" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{languages.map((language) => (
								<DropdownMenuItem
									key={language.code}
									className={`${currentLanguage === language.code ? "bg-accent" : ""} cursor-pointer w-full`}
									onClick={() => languageHandler(language.code)}
								>
									<div className="flex items-center gap-2">
										<span className="text-lg">{language.flag}</span>
										<span>{language.name}</span>
									</div>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* User Menu */}
					{authMember._id ? (
						<UserNav authMember={authMember} />
					) : (
						<div className="flex items-center gap-4">
							<Link href="/auth/login">
								<Button variant="outline" className="text-sm  h-9 px-4">
									{"Login"}
								</Button>
							</Link>
							<Link href="/auth/signup">
								<Button className="text-sm h-9 px-4">{"Sign Up"}</Button>
							</Link>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
