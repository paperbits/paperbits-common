/**
 * Converts array-like object into actual array.
 * @param arrayLikeObject 
 */
export function coerce<T>(arrayLikeObject: any): T[] {
    return Array.prototype.slice.call(arrayLikeObject);
}

/**
 * Removes duplicate values from specified array.
 */
export function distinct<T>(arr: T[]): T[] {
    const uniq: any = [];

    for (const val of arr) {
        uniq[val] = 0;
    }

    return <any>Object.keys(uniq);
}