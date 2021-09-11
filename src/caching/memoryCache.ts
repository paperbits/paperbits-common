import { ILocalCache } from "./ILocalCache";
import * as Objects from "../objects";

export class MemoryCache implements ILocalCache {
    private cacheObject: Object;

    constructor() {
        this.cacheObject = {};
    }

    public async getKeys(): Promise<string[]> {
        return Object.keys(this.cacheObject);
    }

    public async setItem(path: string, value: any): Promise<void> {
        Objects.setValue(path, this.cacheObject, value);
    }

    public async getItem<T>(path: string): Promise<T> {
        const item = Objects.getObjectAt(path, this.cacheObject);

        if (item === undefined) {
            return undefined;
        }

        if (item === null) {
            return null;
        }

        return Objects.clone<T>(item);
    }

    public async removeItem(path: string): Promise<void> {
        Objects.setValue(path, this.cacheObject, undefined);
    }

    public async clear(): Promise<void> {
        this.cacheObject = {};
    }
}