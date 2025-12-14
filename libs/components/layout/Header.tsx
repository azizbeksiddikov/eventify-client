"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReactiveVar } from "@apollo/client/react";
import { Menu, X, Home, Calendar, Users, User2, HelpCircle, ShieldAlert } from "lucide-react";

import { Button, buttonVariants } from "@/libs/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/libs/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/libs/components/ui/sheet";
import { ModeToggle } from "@/libs/components/ui/mode-toggle";
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
	{ href: "/", label: "Home", icon: Home },
	{ href: "/events", label: "Events", icon: Calendar },
	{ href: "/groups", label: "Groups", icon: Users },
	{ href: "/organizers", label: "Organizers", icon: User2 },
	{ href: "/help", label: "Help", icon: HelpCircle },
];
const adminLink = { href: "/_admin", label: "Admin", icon: ShieldAlert };

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

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b w-full">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 flex items-center justify-between h-14 sm:h-16 md:h-20">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2 sm:gap-3 hover:scale-95 transition-transform duration-300">
					<Logo className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
					<span className="text-lg sm:text-xl font-semibold text-foreground">Eventify</span>
				</Link>

				{/* Desktop Navigation - Hidden on mobile/tablet, shown on lg screens */}
				<nav className="hidden lg:flex items-center gap-6 xl:gap-8">
					{navLinks.map((link, index) => (
						<Link
							key={index}
							href={link.href}
							className={cn(
								"text-sm font-medium transition-colors duration-300",
								pathname === link.href
									? "text-foreground font-semibold underline underline-offset-6"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							{link.label}
						</Link>
					))}
					{authMember.memberType === MemberType.ADMIN && (
						<Link
							href={adminLink.href}
							className={cn(
								"text-sm font-medium transition-colors duration-300",
								pathname === adminLink.href
									? "text-foreground font-semibold underline underline-offset-6"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							{adminLink.label}
						</Link>
					)}
				</nav>

				{/* Desktop Auth & Controls - Hidden on mobile/tablet, shown on md screens */}
				<div className="hidden md:flex items-center gap-2 lg:gap-3">
					{/* Notification */}
					{authMember._id && <NotificationDropdown />}

					{/* Theme Mode Switcher */}
					<ModeToggle />

					{/* Language Selector */}
					<DropdownMenu>
						<DropdownMenuTrigger
							className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9 lg:h-10 lg:w-10")}
						>
							<Languages className="h-4 w-4 lg:h-5 lg:w-5" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{languages.map((language) => (
								<DropdownMenuItem
									key={language.code}
									className={cn(currentLanguage === language.code ? "bg-accent" : "", "cursor-pointer w-full")}
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
						<div className="flex items-center gap-2 lg:gap-4">
							<Link href="/auth/login">
								<Button variant="outline" className="text-xs sm:text-sm h-8 lg:h-9 px-3 lg:px-4">
									{"Login"}
								</Button>
							</Link>
							<Link href="/auth/signup">
								<Button className="text-xs sm:text-sm h-8 lg:h-9 px-3 lg:px-4">{"Sign Up"}</Button>
							</Link>
						</div>
					)}
				</div>

				{/* Mobile Controls - Shown on mobile/tablet, hidden on md screens */}
				<div className="flex md:hidden items-center gap-2">
					{/* Notification on mobile */}
					{authMember._id && <NotificationDropdown />}

					{/* User Menu on mobile */}
					{authMember._id ? (
						<UserNav authMember={authMember} />
					) : (
						<Link href="/auth/login">
							<Button variant="ghost" size="sm" className="text-xs h-8 px-2">
								{"Login"}
							</Button>
						</Link>
					)}

					{/* Mobile Menu Sheet */}
					<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="h-9 w-9">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Open menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[300px] sm:w-[350px]">
							<SheetHeader>
								<SheetTitle className="flex items-center justify-between">
									<span>Menu</span>
									<div className="flex items-center gap-2">
										<ModeToggle />
										<DropdownMenu>
											<DropdownMenuTrigger
												className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9")}
											>
												<Languages className="h-4 w-4" />
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												{languages.map((language) => (
													<DropdownMenuItem
														key={language.code}
														className={cn(
															currentLanguage === language.code ? "bg-accent" : "",
															"cursor-pointer w-full",
														)}
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
									</div>
								</SheetTitle>
							</SheetHeader>

							{/* Mobile Navigation Links */}
							<nav className="flex flex-col space-y-1 mt-6">
								{navLinks.map((link, index) => {
									const Icon = link.icon;
									return (
										<Link
											key={index}
											href={link.href}
											onClick={() => setIsMobileMenuOpen(false)}
											className={cn(
												"flex items-center gap-3 h-12 px-4 rounded-lg transition-colors duration-200 group relative",
												pathname === link.href
													? "bg-primary/10 text-primary font-medium"
													: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
											)}
										>
											<Icon
												className={cn(
													"h-5 w-5 transition-colors duration-200",
													pathname === link.href ? "text-primary" : "text-muted-foreground group-hover:text-primary",
												)}
											/>
											<span
												className={cn(
													"text-sm font-medium transition-colors duration-200",
													pathname === link.href ? "text-primary" : "text-muted-foreground group-hover:text-primary",
												)}
											>
												{link.label}
											</span>
											{pathname === link.href && (
												<div className="absolute right-0 top-0 h-full w-1.5 bg-primary rounded-full" />
											)}
										</Link>
									);
								})}
								{authMember.memberType === MemberType.ADMIN && (
									<Link
										href={adminLink.href}
										onClick={() => setIsMobileMenuOpen(false)}
										className={cn(
											"flex items-center gap-3 h-12 px-4 rounded-lg transition-colors duration-200 group relative",
											pathname === adminLink.href
												? "bg-primary/10 text-primary font-medium"
												: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
										)}
									>
										<adminLink.icon
											className={cn(
												"h-5 w-5 transition-colors duration-200",
												pathname === adminLink.href ? "text-primary" : "text-muted-foreground group-hover:text-primary",
											)}
										/>
										<span
											className={cn(
												"text-sm font-medium transition-colors duration-200",
												pathname === adminLink.href ? "text-primary" : "text-muted-foreground group-hover:text-primary",
											)}
										>
											{adminLink.label}
										</span>
										{pathname === adminLink.href && (
											<div className="absolute right-0 top-0 h-full w-1.5 bg-primary rounded-full" />
										)}
									</Link>
								)}
							</nav>

							{/* Mobile Auth Buttons */}
							{!authMember._id && (
								<div className="flex flex-col gap-2 mt-6 pt-6 border-t">
									<Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
										<Button variant="outline" className="w-full text-sm h-10">
											{"Login"}
										</Button>
									</Link>
									<Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
										<Button className="w-full text-sm h-10">{"Sign Up"}</Button>
									</Link>
								</div>
							)}
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
};

export default Header;
