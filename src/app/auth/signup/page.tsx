"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "next-i18next";
import { Eye, EyeOff, User, Star } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader } from "@/libs/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/libs/components/ui/radio-group";
import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Label } from "@/libs/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/libs/components/ui/tooltip";

import { MemberInput } from "@/libs/types/member/member.input";
import { MemberType } from "@/libs/enums/member.enum";
import { friendlyErrorMessage } from "@/libs/errorMessages";
import { smallError } from "@/libs/alert";
import { Message } from "@/libs/enums/common.enum";
import { signUp } from "@/libs/auth";
import { useInlineValidation } from "@/libs/hooks/useInlineValidation";

interface SignupForm extends MemberInput {
	confirmPassword: string;
}

const Signup = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { t } = useTranslation("auth");
	const [formData, setFormData] = useState<SignupForm>({
		username: "",
		memberEmail: "",
		memberPassword: "",
		memberFullName: "",
		confirmPassword: "",
		memberType: MemberType.USER,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const inputHandler = (name: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[name]: name === "username" ? value.toLowerCase() : value,
		}));
	};

	const changeMemberTypeHandler = (value: MemberType) => {
		setFormData((prev) => ({
			...prev,
			memberType: value,
		}));
	};

	// Inline validation (shared hook): a field shows its error after it was left or after a failed submit.
	const errors: Record<string, string | undefined> = {
		username: !formData.username.trim() ? t("username_required") : undefined,
		memberEmail: !formData.memberEmail.trim()
			? t("email_required")
			: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.memberEmail)
				? t("valid_email_required")
				: undefined,
		memberFullName: !formData.memberFullName.trim() ? t("full_name_required") : undefined,
		memberPassword: !formData.memberPassword
			? t("password_required")
			: formData.memberPassword.length < 8
				? t("password_min_length")
				: undefined,
		confirmPassword: !formData.confirmPassword
			? t("confirm_password_required")
			: formData.confirmPassword !== formData.memberPassword
				? t("passwords_mismatch")
				: undefined,
	};
	const { errorProps, errorText, validate } = useInlineValidation(errors, [
		"username",
		"memberEmail",
		"memberFullName",
		"memberPassword",
		"confirmPassword",
	]);

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validate()) return;

		setIsLoading(true);
		try {
			await signUp(
				formData.username,
				formData.memberPassword,
				formData.memberEmail,
				formData.memberFullName,
				formData.memberType ?? MemberType.USER,
			);
			const referrer = searchParams.get("referrer");
			router.push(referrer || "/");
		} catch (err: unknown) {
			smallError(friendlyErrorMessage(err));
			console.log("err", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex-1 my-8 sm:my-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<h1 className="text-2xl sm:text-3xl font-semibold leading-none">{t("create_your_account")}</h1>
					<CardDescription>
						{t("or")}{" "}
						<Link
							href="/auth/login"
							className="inline-block py-3 font-medium text-primary hover:text-primary transition-colors duration-300 underline"
						>
							{t("sign_in_to_account")}
						</Link>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-6" onSubmit={submitHandler}>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label className="text-sm font-medium block text-center mb-4">{t("account_type")}</Label>
								<TooltipProvider>
									<RadioGroup
										defaultValue={MemberType.USER}
										value={formData.memberType}
										onValueChange={changeMemberTypeHandler}
										className="flex flex-row flex-wrap justify-center gap-4"
									>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="flex items-center space-x-2">
													<RadioGroupItem
														value={MemberType.USER}
														id="user"
														className="peer sr-only"
														aria-label={t("regular_user_description")}
													/>
													<Label
														htmlFor="user"
														className="flex items-center gap-2 cursor-pointer rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
													>
														<User className="h-4 w-4" />
														<span className="text-sm font-medium">{t("user")}</span>
													</Label>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p>{t("regular_user_description")}</p>
											</TooltipContent>
										</Tooltip>

										<Tooltip>
											<TooltipTrigger asChild>
												<div className="flex items-center space-x-2">
													<RadioGroupItem
														value={MemberType.ORGANIZER}
														id="organizer"
														className="peer sr-only"
														aria-label={t("organizer_description")}
													/>
													<Label
														htmlFor="organizer"
														className="flex items-center gap-2 cursor-pointer rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
													>
														<Star className="h-4 w-4" />
														<span className="text-sm font-medium">{t("organizer")}</span>
													</Label>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p>{t("organizer_description")}</p>
											</TooltipContent>
										</Tooltip>
									</RadioGroup>
								</TooltipProvider>
							</div>

							<div className="space-y-2">
								<Label htmlFor="username" className="text-sm font-medium">
									{t("username")}
								</Label>
								<Input
									id="username"
									{...errorProps("username")}
									name="username"
									type="text"
									autoComplete="username"
									autoCapitalize="none"
									spellCheck={false}
									value={formData.username}
									onChange={(e) => inputHandler(e.target.name, e.target.value)}
									placeholder={t("enter_username")}
									tabIndex={3}
								/>
								{errorText("username")}
							</div>

							<div className="space-y-2">
								<Label htmlFor="memberEmail" className="text-sm font-medium">
									{t("email_address")}
								</Label>
								<Input
									id="memberEmail"
									{...errorProps("memberEmail")}
									name="memberEmail"
									type="text"
									autoComplete="email"
									inputMode="email"
									autoCapitalize="none"
									spellCheck={false}
									value={formData.memberEmail}
									onChange={(e) => inputHandler(e.target.name, e.target.value)}
									placeholder={t("enter_email")}
									tabIndex={4}
								/>
								{errorText("memberEmail")}
							</div>

							<div className="space-y-2">
								<Label htmlFor="memberFullName" className="text-sm font-medium">
									{t("full_name")}
								</Label>
								<Input
									id="memberFullName"
									{...errorProps("memberFullName")}
									name="memberFullName"
									type="text"
									autoComplete="name"
									value={formData.memberFullName}
									onChange={(e) => inputHandler(e.target.name, e.target.value)}
									placeholder={t("enter_full_name")}
									tabIndex={5}
								/>
								{errorText("memberFullName")}
							</div>

							<div className="space-y-2">
								<Label htmlFor="memberPassword" className="text-sm font-medium">
									{t("password")}
								</Label>
								<div className="relative">
									<Input
										id="memberPassword"
										{...errorProps("memberPassword")}
										name="memberPassword"
										type={showPassword ? "text" : "password"}
										autoComplete="new-password"
										value={formData.memberPassword}
										onChange={(e) => inputHandler(e.target.name, e.target.value)}
										placeholder={t("enter_password")}
										className="pr-10"
										tabIndex={6}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => setShowPassword(!showPassword)}
										aria-label={showPassword ? t("hide_password") : t("show_password")}
										aria-pressed={showPassword}
										className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
										tabIndex={-1}
									>
										{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
									</Button>
								</div>
								{errorText("memberPassword")}
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword" className="text-sm font-medium">
									{t("confirm_password")}
								</Label>
								<div className="relative">
									<Input
										id="confirmPassword"
										{...errorProps("confirmPassword")}
										name="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										autoComplete="new-password"
										value={formData.confirmPassword}
										onChange={(e) => inputHandler(e.target.name, e.target.value)}
										placeholder={t("enter_confirm_password")}
										className="pr-10"
										tabIndex={7}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										aria-label={showConfirmPassword ? t("hide_password") : t("show_password")}
										aria-pressed={showConfirmPassword}
										className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
										tabIndex={-1}
									>
										{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
									</Button>
								</div>
								{errorText("confirmPassword")}
							</div>
						</div>

						<Button type="submit" className="w-full h-11 fine:h-9" disabled={isLoading} tabIndex={8}>
							{isLoading ? t("creating_account") : t("create_account")}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default Signup;
