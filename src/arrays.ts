/**
 * Converts array-like object into actual array.
 * @param arrayLikeObject 
 */
export function coerce<T>(arrayLikeObject: any): T[] {
    return Array.prototype.slice.call(arrayLikeObject);
}

export function remove<T>(array: T[], item: T): void {
    const index = array.indexOf(item);

    if (index < 0) {
        return;
    }

    array.splice(index, 1);
}

/**
 * Removes duplicate values from specified array.
 */
export function distinct<T>(array: T[]): T[] {
    const uniq: any = [];

    for (const item of array) {
        uniq[item] = 0;
    }

    return <any>Object.keys(uniq);
}