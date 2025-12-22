import { useRouter } from "next/navigation";
import { useTranslation } from "next-i18next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/libs/components/ui/button";

const OrganizerHeader = () => {
	const router = useRouter();
	const { t } = useTranslation("organizers");

	return (
		<section className="bg-gradient-to-b from-muted-foreground/10 to-background py-8">
			<div className="max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10 mx-auto flex items-center justify-start mb-4 md:mb-8">
				<Button
					type="button"
					variant="ghost"
					onClick={() => router.push("/organizers")}
					className="h-9 sm:h-11 md:h-12 px-3 sm:px-5 md:px-6 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 group"
				>
					<div className="flex items-center gap-2">
						<ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
						<span className="text-sm sm:text-base font-medium">{t("back_to_organizers")}</span>
					</div>
				</Button>
			</div>
		</section>
	);
};

export default OrganizerHeader;
