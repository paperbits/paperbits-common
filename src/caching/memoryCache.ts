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

    public async setItem(key: string, value: any): Promise<void> {
        Objects.setValue(key, this.cacheObject, value);
    }

    public async getItem<T>(key: string): Promise<T> {
        const item = Objects.getObjectAt(key, this.cacheObject);

        if (!item) {
            return null;
        }

        return Objects.clone<T>(item);
    }

    public async removeItem(key: string): Promise<void> {
        Objects.setValue(key, this.cacheObject, undefined);
    }

    public async clear(): Promise<void> {
        this.cacheObject = {};
    }
}