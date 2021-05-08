import { LocaleModel } from ".";

export interface ILocaleService {
    /**
     * Searches for locales that contain specified pattern in their displayName.
     * @param pattern {string} Search pattern.
     */
    getLocales(): Promise<LocaleModel[]>;

    createLocale(code: string, displayName: string, direction?: string): Promise<LocaleModel>;

    deleteLocale(code: string): Promise<void>;

    /**
     * Returns the code of the current locale.
     */
    getCurrentLocaleCode(): Promise<string>;

    setCurrentLocale(localeCode: string): Promise<void>;

    /**
     * Returns the code of the default locale.
     */
    getDefaultLocaleCode(): Promise<string>;

    isLocalizationEnabled(): Promise<boolean>;
}