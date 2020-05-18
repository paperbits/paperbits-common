import { IObjectStorage } from "../persistence";
import { ISiteService, SiteSettingsContract } from "../sites";
import { ISettingsProvider } from "../configuration";

const settingsPath = "settings";

export class SiteService implements ISiteService {
    constructor(
        private readonly objectStorage: IObjectStorage,
        private readonly settingsProvider: ISettingsProvider
    ) { }

    public async setSiteSettings(settings: SiteSettingsContract): Promise<void> {
        await this.objectStorage.updateObject(`${settingsPath}/site`, settings);
    }

    public async getSiteSettings(): Promise<SiteSettingsContract> {
        return this.objectStorage.getObject<SiteSettingsContract>(`${settingsPath}/site`);
    }

    public async getIntegrationSettings<TSettings>(intergationName: string): Promise<TSettings> {
        let settings = await this.objectStorage.getObject<TSettings>(`${settingsPath}/integration/${intergationName}`);

        if (!settings) {
            settings = await this.settingsProvider.getSetting<TSettings>(intergationName);
        }

        return settings;
    }
}