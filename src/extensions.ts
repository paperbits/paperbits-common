interface String {
    replaceAll(search: string, replacement: string): string;
    hashCode(): number;
}

interface Array<T> {
    remove(item: T): void;
}

String.prototype.replaceAll = function (search: string, replacement: string): string {
    return this.split(search).join(replacement);
};

Array.prototype.remove = function <T>(item: T): void {
    const index = this.indexOf(item);

    if (index < 0) {
        return;
    }
    
    this.splice(index, 1);
};