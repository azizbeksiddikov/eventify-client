import { useTranslation } from 'next-i18next';

const OrganizersHeader = () => {
	const { t } = useTranslation('common');
	return (
		<div className="bg-gradient-to-b from-muted-foreground/10 to-background py-8 ">
			<div className="max-w-7xl mx-auto text-center ">
				<h1 className="text-2xl md:text-3xl font-semibold text-foreground">{t('Organizers')}</h1>
				<p className="mt-2 text-sm md:text-base text-muted-foreground">
					{t('Browse through our list of event organizers')}
				</p>
			</div>
		</div>
	);
};

export default OrganizersHeader;
