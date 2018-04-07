import { IEventManager } from '../events/IEventManager';
import { IHttpClient } from '../http/IHttpClient';
import { ISettingsProvider, Settings } from '../configuration/ISettingsProvider';

export class SettingsProvider implements ISettingsProvider {
    private readonly httpClient: IHttpClient;
    private readonly eventManager: IEventManager;
    private configuration: Object;
    private loadingPromise: Promise<Object>;

    constructor(httpClient: IHttpClient, eventManager: IEventManager) {
        this.httpClient = httpClient;
        this.eventManager = eventManager;
    }

    public getSetting(name: string): Promise<Object> {
        let promise = new Promise(async (resolve, reject) => {
            await this.getSettings();

            if (this.configuration[name]) {
                resolve(this.configuration[name]);
                return;
            }

            let onSettingChange = (setting) => {
                if (setting.name !== name) {
                    return;
                }

                resolve(this.configuration[name]);
                this.eventManager.removeEventListener("onSettingChange", onSettingChange);
            };
            this.eventManager.addEventListener("onSettingChange", onSettingChange);
        });

        return promise;
    }

    public onSettingChange(name: string, eventHandler: (value) => void) {
        this.eventManager.addEventListener("onSettingChange", (setting) => {
            if (setting.name == name) {
                eventHandler(setting.value);
            }
        });
    }

    public setSetting(name: string, value: Object): void {
        this.configuration[name] = value;
        this.eventManager.dispatchEvent("onSettingChange", { name: name, value: value });
    }

    public getSettings(): Promise<any> {
        if (!this.loadingPromise) {
            this.loadingPromise = this.loadSettings();
        }

        return this.loadingPromise;
    }

    private async loadSettings(): Promise<Object> {
        let response = await this.httpClient.send<any>({ url: "/config.json" })
        let config = response.toObject();
        let tenantHostname = window.location.hostname;
        let tenantConfig = config[tenantHostname] || config["default"];

        this.configuration = tenantConfig;

        return tenantConfig;
    }
}