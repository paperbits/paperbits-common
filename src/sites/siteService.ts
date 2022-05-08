import * as Objects from "../objects";
import { IObjectStorage } from "../persistence";
import { ISiteService } from "../sites";


const settingsPath = "settings";

export class SiteService implements ISiteService {
    constructor(private readonly objectStorage: IObjectStorage) { }

    public async getSettings<T>(): Promise<T> {
        const settings = await this.objectStorage.getObject<T>(settingsPath);
        return settings;
    }

    public async setSettings<T>(settings: T): Promise<void> {
        if (!settings) {
            throw new Error(`Parameter "settings" not specified.`);
        }

        await this.objectStorage.updateObject(`${settingsPath}`, settings);
    }

    public async getSetting<T>(key: string): Promise<T> {
        const settings = await this.objectStorage.getObject<Object>(settingsPath);
        const setting = Objects.getObjectAt<T>(key, settings);

        return setting;
    }

    public async setSetting<T>(key: string, setting: T): Promise<void> {
        const settings = await this.objectStorage.getObject<Object>(settingsPath);
        Objects.setValue(key, settings, setting);
        await this.objectStorage.updateObject(`${settingsPath}`, settings);
    }
}