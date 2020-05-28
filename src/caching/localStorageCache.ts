import { ILocalCache } from "./ILocalCache";
import { ISettingsProvider } from "../configuration";

export class LocalStorageCache implements ILocalCache {
    private initializePromise: Promise<void>;
    private containerId: string;

    constructor(private readonly settingsProvider: ISettingsProvider) { }

    private initialize(): Promise<void> {
        if (this.initializePromise) {
            return this.initializePromise;
        }

        this.initializePromise = new Promise<void>(async (resolve) => {
            this.containerId = await this.settingsProvider.getSetting("cacheContainerId") || "default";
            resolve();
        });

        return this.initializePromise;
    }

    public async getKeys(): Promise<string[]> {
        await this.initialize();
        return Object.keys(localStorage);
    }

    public async setItem(key: string, value: any): Promise<void> {
        await this.initialize();
        localStorage.setItem(`${this.containerId}/${key}`, JSON.stringify(value));
    }

    public async getItem<T>(key: string): Promise<T> {
        await this.initialize();
        return <T>JSON.parse(localStorage.getItem(`${this.containerId}/${key}`));
    }

    private async estimateSize(object: any): Promise<number> {
        await this.initialize();

        const list = [];
        const stack = [object];
        let bytes = 0;

        while (stack.length) {
            const value = stack.pop();

            if (!value) {
                continue;
            }
            if (typeof value === "boolean") {
                bytes += 4;
            }
            else if (typeof value === "string") {
                bytes += value.length * 2;
            }
            else if (typeof value === "number") {
                bytes += 8;
            }
            else if (typeof value === "object" &&
                list.indexOf(value) === -1
            ) {
                list.push(value);
                for (const i in value) {
                    if (value.hasOwnProperty(i)) {
                        stack.push(value[i]);
                    }
                }
            }
        }

        return bytes;
    }

    public async getOccupiedSpace(): Promise<number> {
        return 0;
    }

    public async getRemainingSpace(): Promise<number> {
        return 0;
    }

    public addChangeListener(callback: () => void): void {
        // Do nothing
    }

    public async removeItem(key: string): Promise<void> {
        await this.initialize();
        localStorage.removeItem(`${this.containerId}/${key}`);
    }

    public async clear(): Promise<void> {
        localStorage.clear();
    }
}