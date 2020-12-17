import { Bag } from "../bag";

interface ICacheItem<T> {
    key: string;
    value: T;
    next: ICacheItem<T>;
    prev: ICacheItem<T>;
}

/**
 * Basic LRU cache utility.
 */
export class LruCache<T> {
    private nodeMap: Bag<ICacheItem<T>> = {};
    private tail: ICacheItem<T>;
    private head: ICacheItem<T>;

    constructor(
        private maxSize: number = 10000,
        private onEvict?: (key: string, value: T) => void) {
    }

    /**
     * Returns cached item with specified key.
     * @param key {string} Item key.
     */
    public getItem(key: string): T {
        const item: ICacheItem<T> = this.nodeMap[key];

        if (!item) {
            return null;
        }

        this.pop(item);

        return item.value;
    }

    /**
     * Puts specified into cache.
     * @param key {string} Item key.
     * @param value {string} Item value.
     */
    public setItem(key: string, value: T): void {
        const item: ICacheItem<T> = this.nodeMap[key];

        if (item) {
            item.value = value;
            this.pop(item);
        }
        else {
            this.insert(key, value);
        }
    }

    public clear(): void {
        this.head = null;
        this.nodeMap = {};
    }

    /**
     * Removes item from the cache.
     * @param key {string} Item key.
     */
    public removeItem(key: string): void {
        const item = this.nodeMap[key];
        this.remove(item);
    }

    /**
     * Removed item matching to predicate.
     * @param predicate Predicate.
     */
    public removeWhere(predicate: (key: string, value: T) => boolean): void {
        let item: ICacheItem<T> = this.head;

        if (!item) {
            return;
        }

        do {
            if (predicate(item.key, item.value)) {
                this.removeItem(item.key);
            }
        }
        while ((item = item.next) !== null);
    }

    /**
     * Returns all keys of cached objects.
     */
    public getKeys(): string[] {
        const result: string[] = new Array<string>();
        let item: ICacheItem<T> = this.head;

        if (!item) {
            return result;
        }

        do {
            result.push(item.key);
        }
        while ((item = item.next) !== null);

        return result;
    }

    /**
     * Returns number of cached items.
     */
    public size(): number {
        return Object.keys(this.nodeMap).length;
    }

    private pop(item: ICacheItem<T>): void {
        if (item === this.head) {
            return;
        }
        item.prev.next = item.next;

        if (item.next) {
            item.next.prev = item.prev;
        }
        else {
            this.tail = item.prev;
        }
        item.next = this.head;
        this.head.prev = item;
        item.prev = null;
        this.head = item;
    }

    private insert(key: string, value: T): void {
        if (Object.keys(this.nodeMap).length === this.maxSize) {
            const tail = this.tail;
            this.remove(tail);

            if (this.onEvict) {
                this.onEvict(tail.key, tail.value);
            }
        }

        if (!this.head) {
            this.head = <ICacheItem<T>>{
                key: key,
                value: value,
                prev: null,
                next: null
            };
            this.tail = this.head;
        }
        else {
            this.head = <ICacheItem<T>>{
                key: key,
                value: value,
                prev: null,
                next: this.head
            };
            this.head.next.prev = this.head;
        }

        this.nodeMap[key] = this.head;
    }

    private remove(item: ICacheItem<T>): void {
        if (!item) {
            return;
        }
        delete this.nodeMap[item.key];

        if (!this.head) {
            return;
        }

        if (this.head === item) {
            this.head = item.next;
            this.head.prev = null;
            return;
        }

        if (this.tail === item) {
            this.tail = this.tail.prev;
            this.tail.next = null;
            return;
        }

        item.prev.next = item.next;
        item.next.prev = item.prev;
    }
}