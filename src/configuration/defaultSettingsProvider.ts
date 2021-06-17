import * as Objects from "../objects";
import { EventManager } from "../events";
import { HttpClient } from "../http";
import { ISettingsProvider } from "../configuration";


export class DefaultSettingsProvider implements ISettingsProvider {
    private configuration: Object;
    private initializePromise: Promise<void>;

    constructor(
        private readonly httpClient: HttpClient,
        private readonly eventManager: EventManager
    ) { }

    private async ensureInitialized(): Promise<void> {
        if (!this.initializePromise) {
            this.initializePromise = this.loadSettings();
        }
        return this.initializePromise;
    }

    private async loadSettings(): Promise<void> {
        const response = await this.httpClient.send<any>({ url: "/config.json" });
        const loadedConfiguration = response.toObject();

        const searializedDesignTimeSettings = sessionStorage?.getItem("designTimeSettings");

        if (searializedDesignTimeSettings) {
            const designTimeSettings = JSON.parse(searializedDesignTimeSettings);
            Object.assign(loadedConfiguration, designTimeSettings);
        }

        this.configuration = loadedConfiguration;
    }

    public async getSetting<T>(name: string): Promise<T> {
        await this.ensureInitialized();
        return Objects.getObjectAt(name, this.configuration);
    }

    public onSettingChange<T>(name: string, eventHandler: (value: T) => void): void {
        this.eventManager.addEventListener("onSettingChange", (setting) => {
            if (setting.name === name) {
                eventHandler(setting.value);
            }
        });
    }

    public async setSetting<T>(name: string, value: T): Promise<void> {
        await this.ensureInitialized();

        Objects.setValue(name, this.configuration, value);
        this.eventManager.dispatchEvent("onSettingChange", { name: name, value: value });
    }

    public async getSettings(): Promise<any> {
        await this.ensureInitialized();

        return this.configuration;
    }
}