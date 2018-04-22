import { ISettingsProvider, Settings } from "./../configuration/ISettingsProvider";
import { MediaContract } from '../media/mediaContract';
import { IObjectStorage } from '../persistence/IObjectStorage';
import { ISiteService } from '../sites/ISiteService';
import { ISettings } from '../sites/ISettings';

const settingsPath = "settings";
const gmapsConfigPath = "settings/config/googlemaps";
const gtmConfigPath = "settings/config/gtm";
const intercomConfigPath = "settings/config/intercom";

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

        return await this.objectStorage.getObject<ISettings>(settingsPath);
    }
}