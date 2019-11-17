interface String {
    contains(value: string, caseInsensitive?: boolean): boolean;
    format(...value: any[]): string;
    startsWith(value: string): boolean;
    endsWith(value: string): boolean;
    replaceAll(search: string, replacement: string): string;
    hashCode(): number;
}

interface Array<T> {
    remove(item: T): void;
}

String.prototype.contains = function (value: string, caseInsensitive: boolean = false): boolean {
    let originalValue: string = this;

    if (caseInsensitive) {
        originalValue = originalValue.toLowerCase();
        value = value.toLowerCase();
    }

    return originalValue.indexOf(value) !== -1;
};


String.prototype.format = function (...values: any[]): string {
    let formatted = this;
    for (let i = 0; i < values.length; i++) {
        const regexp = new RegExp("\\{" + i + "\\}", "gi");

        if (values[i]) {
            formatted = formatted.replace(regexp, values[i]);
        }
        else {
            formatted = formatted.replace(regexp, "");
        }
    }
    return formatted;
};

String.prototype.startsWith = function (value: string): boolean {
    return this.substring(0, value.length) === value;
};

String.prototype.endsWith = function (value: string): boolean {
    return this.lastIndexOf(value) === this.length - value.length;
};

String.prototype.hashCode = function (): number {
    let hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

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