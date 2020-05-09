import { ILocalCache } from "./ILocalCache";

export class LocalStorageCache implements ILocalCache {
    public async getKeys(): Promise<string[]> {
        return Object.keys(localStorage);
    }

    public async setItem(key: string, value: any): Promise<void> {
        localStorage.setItem(key, JSON.stringify(value));
    }

    public async getItem<T>(key: string): Promise<T> {
        return <T>JSON.parse(localStorage.getItem(key));
    }

    private async estimateSize(object: any): Promise<number> {
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
        localStorage.removeItem(key);
    }

    public async clear(): Promise<void> {
        localStorage.clear();
    }
}