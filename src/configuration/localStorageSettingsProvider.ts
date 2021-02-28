import * as Objects from "../objects";
import { EventManager } from "../events";
import { ISettingsProvider } from "./ISettingsProvider";

const localStorageItemName = "paperbits";

export class LocalStorageSettingsProvider implements ISettingsProvider {
    constructor(private readonly eventManager: EventManager) { }

    public async getSetting<T>(name: string): Promise<T> {
        const settingsObject = await this.getSettings();
        return Objects.getObjectAt(name, settingsObject);
    }

    public onSettingChange<T>(name: string, eventHandler: (value: T) => void): void {
        this.eventManager.addEventListener("onSettingChange", (setting) => {
            if (setting.name !== name) {
                return;
            }

            eventHandler(setting.value);
        });
    }

    public async setSetting<T>(name: string, value: T): Promise<void> {
        const settings = await this.getSettings();
        Objects.setValue(name, settings, value);
        localStorage.setItem(localStorageItemName, JSON.stringify(settings));

        this.eventManager.dispatchEvent("onSettingChange", { name: name, value: value });
    }

    public async getSettings(): Promise<any> {
        const storedSettings = localStorage.getItem(localStorageItemName);

        if (!storedSettings) {
            return <any>{};
        }

        const settingsObject = JSON.parse(storedSettings);
        return settingsObject;
    }
}