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
            displayName: "English (US)"
        };

        const result = await this.objectStorage.getObject(localesPath);

        if (!result) {
            return [localeEnUs];
        }

        const locales = Object.values(result);

        return [localeEnUs].concat(locales);
    }

    public async createLocale(code: string, displayName: string): Promise<void> {
        const key = `${localesPath}/${code}`;

        const locale: LocaleModel = {
            key: key,
            code: code,
            displayName: displayName
        };

        await this.objectStorage.addObject(key, locale);
    }

    public async deleteLocale(code: string): Promise<void> {
        // TODO
    }

    public async getDefaultLocale(): Promise<string> {
        return "en-us";
    }

    public async getCurrentLocale(): Promise<string> {
        return this.currentLocale;
    }

    public async setCurrentLocale(localeCode: string): Promise<void> {
        this.currentLocale = localeCode;
    }

    public async isLocalizationEnabled(): Promise<boolean> {
        return true;
    }
}