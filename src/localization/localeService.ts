import { ILocaleService } from "./ILocaleService";
import { LocaleModel } from ".";
import { IObjectStorage } from "../persistence";

const localesPath = "locales";

export class LocaleService implements ILocaleService {
    private currentLocale: string;

    constructor(private objectStorage: IObjectStorage) {
        this.currentLocale = "en-us";
    }

    public async getLocales(): Promise<LocaleModel[]> {
        const localeEnUs: LocaleModel = {
            key: `${localesPath}/en-us`,
            code: "en-us",
            displayName: "English (US)",
        };

        const pageOfLocales = await this.objectStorage.searchObjects<LocaleModel>(localesPath);

        return [localeEnUs].concat(pageOfLocales.value);
    }

    public async createLocale(code: string, displayName: string, direction: string = "ltr"): Promise<LocaleModel> {
        const key = `${localesPath}/${code}`;

        const locale: LocaleModel = {
            key: key,
            code: code,
            direction: direction,
            displayName: displayName
        };

        await this.objectStorage.addObject(key, locale);

        return locale;
    }

    public async deleteLocale(code: string): Promise<void> {
        // TODO
    }

    public async getDefaultLocaleCode(): Promise<string> {
        return "en-us";
    }

    public async getCurrentLocaleCode(): Promise<string> {
        return this.currentLocale;
    }

    public async setCurrentLocale(localeCode: string): Promise<void> {
        this.currentLocale = localeCode;
    }

    public async isLocalizationEnabled(): Promise<boolean> {
        return true;
    }
}