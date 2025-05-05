import { useTranslation } from 'react-i18next';

const Footer = () => {
	const { t } = useTranslation('common');
	return (
		<footer className="px-4 sm:px-6 lg:px-8 pt-16 pb-12 w-full bg-foreground/95 backdrop-blur-sm flex justify-center align-center">
			<div className="container flex flex-col md:flex-row justify-between items-center gap-6">
				<p className="text-sm text-background">© 2025 Eventify. {t('All rights reserved')}.</p>
				<div className="flex items-center gap-8">
					<div className="text-sm text-background transition-colors">{t('Privacy Policy')}</div>
					<div className="text-sm text-background transition-colors">{t('Terms of Service')}</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
