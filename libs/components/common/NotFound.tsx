"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "next-i18next";
import { SearchX, ArrowLeft } from "lucide-react";
import { Button } from "@/libs/components/ui/button";

interface NotFoundProps {
	title?: string;
	message?: string;
	backPath?: string;
	backLabel?: string;
}

const NotFound = ({ title, message, backPath, backLabel }: NotFoundProps) => {
	const router = useRouter();
	const { t } = useTranslation("common");

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in zoom-in duration-500">
			<div className="bg-muted/50 rounded-full p-8 mb-6 ring-8 ring-muted/20">
				<SearchX className="w-16 h-16 text-muted-foreground/50" />
			</div>

			<h1 className="text-3xl font-bold text-foreground mb-3">{title || t("Content Not Found")}</h1>

			<p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
				{message || t("The requested information could not be found. It may have been removed or the ID is incorrect.")}
			</p>

			<Button
				variant="outline"
				onClick={() => (backPath ? router.push(backPath) : router.back())}
				className="flex items-center gap-2 px-6 h-11 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
			>
				<ArrowLeft className="w-4 h-4" />
				{backLabel || t("Go Back")}
			</Button>
		</div>
	);
};

export default NotFound;
