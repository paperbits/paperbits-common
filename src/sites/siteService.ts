import { ISettingsProvider, Settings } from "./../configuration";
import { IObjectStorage } from "../persistence";
import { SettingsContract, ISiteService } from "../sites";

const settingsPath = "settings";

export class SiteService implements ISiteService {
    private objectStorage: IObjectStorage;
    private settingsProvider: ISettingsProvider;

    constructor(objectStorage: IObjectStorage, settingsProvider: ISettingsProvider) {
        this.objectStorage = objectStorage;
        this.settingsProvider = settingsProvider;
    }

    public async setSiteSettings(settings: SettingsContract): Promise<void> {
        await this.objectStorage.updateObject(settingsPath, settings);
        await this.settingsProvider.setSetting(Settings.Config.Gtm, settings.integration.gtm);
        await this.settingsProvider.setSetting(Settings.Config.GMaps, settings.integration.googleMaps);
        await this.settingsProvider.setSetting(Settings.Config.Intercom, settings.integration.intercom);
        await this.settingsProvider.setSetting(Settings.Config.GoogleFonts, settings.integration.googleFonts);
    }

    public async getSiteSettings(): Promise<SettingsContract> {
        return this.objectStorage.getObject<SettingsContract>(settingsPath);
    }
}