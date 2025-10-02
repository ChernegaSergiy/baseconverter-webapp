export const availableLanguages = ['de', 'en', 'fr', 'pl', 'uk'];

export function useTranslation(lang) {
    const translations = require(`../public/locales/${lang}.json`);

    const t = (key) => {
        return translations[key] || key;
    }

    return { t };
}
