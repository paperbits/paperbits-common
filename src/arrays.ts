export function coerce<T>(arrayLikeObject): T[] {
    return Array.prototype.slice.call(arrayLikeObject);
}