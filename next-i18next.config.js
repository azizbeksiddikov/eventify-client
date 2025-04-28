module.exports = {
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'ru', 'uz'],
	},
	localePath: './public/locales',
	reloadOnPrerender: process.env.NODE_ENV === 'development',
};
