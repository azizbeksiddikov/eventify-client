module.exports = {
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'ko', 'ru', 'uz'],
		localeDetection: false,
	},
	trailingSlash: true,
	fallbackLng: 'en',
	localePath: './public/locales',
	ns: ['common'],
	reloadOnPrerender: process.env.NODE_ENV === 'development',
};
