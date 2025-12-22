import { useTranslation } from "next-i18next";

const OrganizersHeader = () => {
	const { t } = useTranslation("organizers");

	return (
		<div className="bg-gradient-to-b from-muted-foreground/10 to-background py-8">
			<div className="flex flex-col md:flex-row items-center justify-between mb-8 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
				<div className="text-center w-full mb-4 md:mb-0">
					<h2>{t("organizers")}</h2>
					<p className="text-muted-foreground mt-2 text-base md:text-lg">{t("browse_organizers_description")}</p>
				</div>
			</div>
		</div>
	);
};

export default OrganizersHeader;
