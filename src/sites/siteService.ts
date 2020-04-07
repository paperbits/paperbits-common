import { ISettingsProvider, Settings } from "./../configuration";
import { IObjectStorage } from "../persistence";
import { SettingsContract, ISiteService } from "../sites";

const settingsPath = "settings";

export class SiteService implements ISiteService {
    constructor(
        private readonly objectStorage: IObjectStorage,
        private readonly settingsProvider: ISettingsProvider
    ) { }

    public async setSiteSettings(settings: SettingsContract): Promise<void> {
        await this.objectStorage.updateObject(settingsPath, settings);
        await this.settingsProvider.setSetting(Settings.Config.GoogleTagManager, settings.integration.googleTagManager);
        await this.settingsProvider.setSetting(Settings.Config.GoogleMaps, settings.integration.googleMaps);
        await this.settingsProvider.setSetting(Settings.Config.Intercom, settings.integration.intercom);
        await this.settingsProvider.setSetting(Settings.Config.GoogleFonts, settings.integration.googleFonts);
    }

    public async getSiteSettings(): Promise<SettingsContract> {
        return this.objectStorage.getObject<SettingsContract>(settingsPath);
    }
}