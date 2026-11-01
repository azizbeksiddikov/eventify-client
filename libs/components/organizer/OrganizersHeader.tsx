import { useTranslation } from "next-i18next";

const OrganizersHeader = () => {
	const { t } = useTranslation("organizers");

	return (
		<div className="bg-gradient-to-b from-muted-foreground/10 to-background py-5 sm:py-8">
			<div className="flex flex-col md:flex-row items-center justify-between sm:mb-8 max-w-7xl mx-auto px-4 sm:px-12 lg:px-20">
				<div className="text-left w-full">
					<h1 className="text-2xl sm:text-3xl">{t("organizers")}</h1>
					<p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base md:text-lg">{t("browse_organizers_description")}</p>
				</div>
			</div>
		</div>
	);
};

export default OrganizersHeader;
