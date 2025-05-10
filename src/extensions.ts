interface String {
    replaceAll(search: string, replacement: string): string;
    hashCode(): number;
}

interface Array<T> {
    remove(item: T): void;
}

Array.prototype.remove = function <T>(item: T): void {
    const index = this.indexOf(item);

    if (index < 0) {
        return;
    }
    
    this.splice(index, 1);
};