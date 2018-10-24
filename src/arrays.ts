/**
 * Converts array-like object into actual array.
 * @param arrayLikeObject 
 */
export function coerce<T>(arrayLikeObject): T[] {
    return Array.prototype.slice.call(arrayLikeObject);
}