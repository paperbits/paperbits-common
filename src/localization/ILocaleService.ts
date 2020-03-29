import { LocaleModel } from ".";

export interface ILocaleService {
    /**
     * Searches for locales that contain specified pattern in their displayName.
     * @param pattern {string} Search pattern.
     */
    getLocales(): Promise<LocaleModel[]>;

    createLocale(code: string, displayName: string): Promise<void>;

    deleteLocale(code: string): Promise<void>;

    getCurrentLocale(): Promise<string>;

    setCurrentLocale(localeCode: string): Promise<void>;

    getDefaultLocale(): Promise<string>;

    isLocalizationEnabled(): Promise<boolean>;
}