import { ISettingsProvider, Settings } from "./../configuration";
import { IObjectStorage } from "../persistence";
import { ISettings, ISiteService } from "../sites";

const settingsPath = "settings";

export class SiteService implements ISiteService {
    private objectStorage: IObjectStorage;
    private settingsProvider: ISettingsProvider;

    constructor(objectStorage: IObjectStorage, settingsProvider: ISettingsProvider) {
        this.objectStorage = objectStorage;
        this.settingsProvider = settingsProvider;
    }

    public async setSiteSettings(settings: ISettings): Promise<void> {
        await this.objectStorage.updateObject(settingsPath, settings);
        await this.settingsProvider.setSetting(Settings.Config.Gtm, settings.integration.gtm);
        await this.settingsProvider.setSetting(Settings.Config.GMaps, settings.integration.googlemaps);
        await this.settingsProvider.setSetting(Settings.Config.Intercom, settings.integration.intercom);
    }

    public async getSiteSettings(): Promise<ISettings> {
        return this.objectStorage.getObject<ISettings>(settingsPath);
    }
}