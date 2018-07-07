interface ICacheItem<T> {
    key: string;
    value: T;
    next: ICacheItem<T>;
    prev: ICacheItem<T>;
}

export class LruCache<T> {

    private nodeMap = {};
    private tail: ICacheItem<T>;
    private head: ICacheItem<T>;

    constructor(
        private maxSize: number = 10000,
        private onevict?: (key: string, value: T) => void) {
    }

    public getItem(key): T {
        let item: ICacheItem<T> = this.nodeMap[key];

        if (!item) {
            return null;
        }

        this.pop(item);

        return item.value;
    }

    public setItem(key, value) {
        let item: ICacheItem<T> = this.nodeMap[key];
        if (item) {
            item.value = value;
            this.pop(item);
        } else {
            this.insert(key, value);
        }
    }

    public clear() {
        this.head = null;
        this.nodeMap = {};
    }

    public removeItem(key: string) {
        let item = this.nodeMap[key];
        this.remove(item);
    }

    public removeWhere(predicate: (key: string, value: T) => boolean) {
        let item: ICacheItem<T> = this.head;

        if (!item) {
            return;
        }

        do {
            if (predicate(item.key, item.value)) {
                this.removeItem(item.key);
            }
        } while ((item = item.next) != null);
    }

    public getKeys(): Array<string> {
        let result: Array<string> = new Array<string>();
        let item: ICacheItem<T> = this.head;

        if (!item) {
            return result;
        }

        do {
            result.push(item.key);
        } while ((item = item.next) != null);

        return result;
    }

    public size() {
        return Object.keys(this.nodeMap).length;
    }

    private pop(item: ICacheItem<T>): void {
        if (item === this.head) {
            return;
        }
        item.prev.next = item.next;
        if (item.next) {
            item.next.prev = item.prev;
        } else {
            this.tail = item.prev;
        }
        item.next = this.head;
        this.head.prev = item;
        item.prev = null;
        this.head = item;
    }

    private insert(key: string, value: T): void {
        if (Object.keys(this.nodeMap).length === this.maxSize) {
            let tail = this.tail;
            this.remove(tail);
            this.onevict(tail.key, tail.value);
        }
        if (!this.head) {
            this.head = <ICacheItem<T>>{
                key: key,
                value: value,
                prev: null,
                next: null
            };
            this.tail = this.head;
        } else {
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