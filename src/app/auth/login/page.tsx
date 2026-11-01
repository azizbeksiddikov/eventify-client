"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader } from "@/libs/components/ui/card";

import { LoginInput } from "@/libs/types/member/member.input";
import { logIn } from "@/libs/auth";
import { friendlyErrorMessage } from "@/libs/errorMessages";
import { smallError } from "@/libs/alert";
import { useInlineValidation } from "@/libs/hooks/useInlineValidation";

const Login = () => {
	const { t } = useTranslation("auth");
	const router = useRouter();
	const searchParams = useSearchParams();
	const [loginInput, setLoginInput] = useState<LoginInput>({
		username: "",
		memberPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	/** HANDLERS **/
	const inputHandler = useCallback((name: string, value: string) => {
		setLoginInput((prev) => ({
			...prev,
			[name]: value,
		}));
	}, []);

	// Inline validation: errors appear under the field once it was left, or after a failed submit
	const errors = {
		username: !loginInput.username.trim() ? t("username_required") : undefined,
		memberPassword: !loginInput.memberPassword ? t("password_required") : undefined,
	};
	const { errorProps, errorText, validate } = useInlineValidation(errors, ["username", "memberPassword"]);

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validate()) return;

		setIsLoading(true);
		try {
			await logIn(loginInput.username, loginInput.memberPassword);
			const referrer = searchParams.get("referrer");
			router.push(referrer || "/");
		} catch (err: unknown) {
			smallError(friendlyErrorMessage(err));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex-1 my-8 sm:my-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<h1 className="text-2xl sm:text-3xl font-semibold leading-none">{t("login")}</h1>
					<CardDescription>
						{t("or")}
						<Link
							href="/auth/signup"
							className="inline-block py-3 font-medium text-primary hover:text-primary transition-colors duration-300 underline"
						>
							{" "}
							{t("create_new_account")}
						</Link>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-6" onSubmit={submitHandler}>
						<div className="space-y-4">
							<div className="space-y-2">
								<label htmlFor="username" className="text-sm font-medium">
									{t("username")}
								</label>
								<Input
									id="username"
									{...errorProps("username")}
									name="username"
									type="text"
									autoComplete="username"
									autoCapitalize="none"
									spellCheck={false}
									value={loginInput.username}
									onChange={(e) => inputHandler(e.target.name, e.target.value)}
									placeholder={t("enter_username")}
								/>
								{errorText("username")}
							</div>

							<div className="space-y-2">
								<label htmlFor="memberPassword" className="text-sm font-medium">
									{t("password")}
								</label>
								<div className="relative">
									<Input
										id="memberPassword"
										{...errorProps("memberPassword")}
										name="memberPassword"
										type={showPassword ? "text" : "password"}
										autoComplete="current-password"
										value={loginInput.memberPassword}
										onChange={(e) => inputHandler(e.target.name, e.target.value)}
										placeholder={t("enter_password")}
										className="pr-10"
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => setShowPassword(!showPassword)}
										aria-label={showPassword ? t("hide_password") : t("show_password")}
										aria-pressed={showPassword}
										className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
									>
										{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
									</Button>
								</div>
								{errorText("memberPassword")}
							</div>
						</div>

						<Button type="submit" className="w-full h-11 fine:h-9" disabled={isLoading}>
							{isLoading ? t("signing_in") : t("sign_in")}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default Login;
