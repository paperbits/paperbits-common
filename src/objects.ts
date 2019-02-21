import * as CJSON from "circular-json";

export function isObject(item): boolean {
    return item !== undefined && (item && typeof item === "object" && !Array.isArray(item));
}

export function getObjectAt<T>(path: string, source: object, delimiter: string = "/"): T {
    const segments = path.split(delimiter);
    let segmentObject = source;

    for (const segment of segments) {
        segmentObject = segmentObject[segment];

        if (!segmentObject) {
            return undefined;
        }
    }

    return <any>segmentObject;
}

/**
 * Applies changes to a target and returns reverse changeset that can be used to rollback changes.
 * @param target 
 * @param changeset 
 * @returns {object} Reverse changeset.
 */
export function mergeDeep(target: Object, changeset: Object, cleanNulls: boolean = true): Object {
    const reverseChangeset = {};

    if (isObject(target) && isObject(changeset)) {
        Object.keys(changeset).forEach(key => {
            const sourceProperty = changeset[key];

            if (isObject(sourceProperty)) {
                if (target[key] !== undefined && target[key] !== null) {
                    reverseChangeset[key] = mergeDeep(target[key], sourceProperty, cleanNulls);
                }
                else { // if not present in target, safely assign whole source.
                    if (target[key] !== sourceProperty) {
                        reverseChangeset[key] = target[key] || null;
                        target[key] = sourceProperty;

                        if (cleanNulls) {
                            if (target[key] === null || target[key] === undefined) {
                                delete target[key];
                            }
                        }
                    }
                }
            }
            else { // if value or array, just assign as is.
                if (target[key] !== sourceProperty) {
                    reverseChangeset[key] = target[key] || null;
                    target[key] = sourceProperty;

                    if (cleanNulls) {
                        if (target[key] === null || target[key] === undefined) {
                            delete target[key];
                        }
                    }
                }
            }
        });
    }

    return reverseChangeset;
}

export function mergeDeepAt(path: string, target: any, source: any, cleanNulls: boolean = true) {
    if (Array.isArray(source)) {
        setValueAt(path, target, source);
    }
    else {
        const updatingObject = setStructure(path, target);
        mergeDeep(updatingObject, source, cleanNulls);
    }
}

export function setStructure(path: string, target: object, delimiter: string = "/"): object {
    const segments = path.split(delimiter);
    let segmentObject = target;

    segments.forEach(segment => {
        if (!segmentObject[segment]) {
            segmentObject[segment] = {};
        }
        segmentObject = segmentObject[segment];
    });

    return segmentObject;
}

/**
 * Remove all properties with undefined value from object.
 */
export function cleanupObject(source: object, includingNulls: boolean = false): void {
    if (source instanceof Object) {
        Object.keys(source).forEach(key => {
            const child = source[key];

            if (child instanceof Object) {
                cleanupObject(child, includingNulls);

                if (Object.keys(child).length === 0) {
                    delete source[key];
                }
            }
            else if (child === undefined || (includingNulls && child === null)) {
                delete source[key];
            }
        });
    }
}

export function setValueAt(path: string, target: object, value: any): object {
    const compensation = getObjectAt(path, clone(target));

    const segments = path.split("/");
    let segmentObject = target;

    for (let i = 0; i < segments.length - 1; i++) {
        const segment = segments[i];

        if (!segmentObject[segment]) {
            segmentObject[segment] = {};
        }
        segmentObject = segmentObject[segment];
    }

    segmentObject[segments[segments.length - 1]] = value;

    /* Ensure all "undefined" are cleanedup */
    cleanupObject(target);

    return compensation;
}

export function deleteNodeAt(path: string, target: object): void {
    const segments = path.split("/");
    let segmentObject = target;

    for (let i = 0; i < segments.length - 1; i++) {
        const segment = segments[i];

        if (!segmentObject[segment]) {
            segmentObject[segment] = {};
        }
        segmentObject = segmentObject[segment];
    }

    delete segmentObject[segments[segments.length - 1]];

    // TODO: Try to delete entire trail, if empty
}

export function clone<T>(obj: Object): T {
    return <T>CJSON.parse(CJSON.stringify(obj));
}