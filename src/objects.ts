export function isObject(item: any): boolean {
    return item !== undefined && (item && typeof item === "object" && !Array.isArray(item));
}

export function getObjectAt<T>(path: string, source: object, delimiter: string = "/"): T {
    const segments = path.split(delimiter);
    let segmentObject = source;

    for (const segment of segments) {
        segmentObject = segmentObject[segment];

        if (segmentObject === null || segmentObject === undefined) {
            return <any>segmentObject;
        }
    }

    return <any>segmentObject;
}

/**
 * Applies changes to a target and returns reverse changeset that can be used to rollback changes.
 * @param target {object} Object to which changes are being applied.
 * @param changeset {object} Object that needs to be merged into targt object.
 * @param removeNulls {boolean} Indicates that properties with "null" values should be removed.
 * @returns {object} Reverse changeset.
 */
export function mergeDeep(target: Object, changeset: Object, removeNulls: boolean = false): Object {
    const reverseChangeset = {};

    if (isObject(target) && isObject(changeset)) {
        Object.keys(changeset).forEach(key => {
            const sourceProperty = changeset[key];

            if (isObject(sourceProperty)) {
                if (target[key] !== undefined && target[key] !== null) {
                    reverseChangeset[key] = mergeDeep(target[key], sourceProperty, removeNulls);
                }
                else { // if not present in target, safely assign whole source.
                    if (target[key] !== sourceProperty) {
                        reverseChangeset[key] = target[key] || null;
                        target[key] = sourceProperty;

                        if (removeNulls) {
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

                    if (removeNulls) {
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

export function mergeDeepAt(path: string, target: any, source: any, removeNulls: boolean = false): void {
    if (Array.isArray(source)) {
        setValueWithCompensation(path, target, source);
    }
    else {
        const updatingObject = setStructure(path, target);
        mergeDeep(updatingObject, source, removeNulls);
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

export interface CleanupOptions {
    /**
     * If the node property value is null, the property gets removed from the node.
     */
    removeNulls?: boolean;

    /**
     * If all child properties of the node are null, the node itself becomes null.
     */
    collapseNulls?: boolean;

    /**
     * If the node property is an empty string, the property gets removed from the node.
     */
    removeEmptyString?: boolean;
}

/**
 * Removes all properties with `undefined` value from object.
 * @param source {object} An object that needs to be cleaned.
 */
export function cleanupObject(source: object, options?: CleanupOptions): void {
    if (options?.removeNulls && options?.collapseNulls) {
        throw new Error(`Cannot remove and collapse nulls at the same time.`);
    }

    if (!(source instanceof Object)) {
        return;
    }

    Object.keys(source).forEach(key => {
        const childNode = source[key];

        if (Array.isArray(childNode)) {
            childNode.forEach(x => cleanupObject(x, options));

            if (childNode.length === 0) {
                source[key] = null;

                if (options?.removeNulls) {
                    delete source[key];
                }
            }
        }
        else if (childNode instanceof Object) {
            cleanupObject(childNode, options);

            if (Object.keys(childNode).length === 0) {
                delete source[key];
            }
            else if (options?.collapseNulls) {
                const hasNonNullProps = Object.values(childNode).some(x => x !== null);

                if (!hasNonNullProps) { // collapse empty nodes
                    source[key] = null;
                }
            }
        }
        else if (childNode === undefined || (options?.removeNulls && childNode === null) || (options?.removeEmptyString && childNode === "")) {
            delete source[key];
        }
    });
}


/**
 * Sets value in an object tree and returns compensation tree.
 * @param path Object tree path.
 * @param target Object tree root.
 * @param value 
 */
export function setValueWithCompensation(path: string, target: object, value: any): object {
    const original: any = clone(target);
    const compensation = getObjectAt(path, original);

    setValue(path, target, value);

    return <any>compensation;
}

/**
 * Sets value in an object tree.
 * @param path Object tree path.
 * @param target Object tree root.
 * @param value 
 */
export function setValue(path: string, target: object, value: any): void {
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
    return <T>JSON.parse(JSON.stringify(obj));
}

export function findObjects(source: object, predicate: (node: object) => boolean): object[] {
    let result = [];
    const keys = Object.keys(source);

    for (const key of keys) {
        const node = source[key];

        if (predicate(node)) {
            result.push(node);
        }
        else {
            const childResult = findObjects(node, predicate);
            result = result.concat(childResult);
        }
    }

    return result;
}

export function isEmpty(source: object): boolean {
    return !source || Object.keys(source).length === 0;
}

export function deepFreeze(obj: object): void {
    const propNames = Object.getOwnPropertyNames(obj);

    for (const name of propNames) {
        const value = obj[name];

        if (value && typeof value === "object") {
            this.deepFreeze(value);
        }
    }

    Object.freeze(obj);
}

export function generateChangeset(target: Object, source: Object, collapseEmptyNodes: boolean = false): Object {
    const changeset = {};

    if (!isObject(target) || !isObject(source)) {
        return changeset;
    }

    Object.keys(source).forEach(key => {
        const sourceProperty = source[key];
        const targetProperty = target[key];

        if (isObject(sourceProperty)) {
            if (targetProperty !== undefined && targetProperty !== null) {
                changeset[key] = generateChangeset(targetProperty, sourceProperty);

                if (collapseEmptyNodes && !Object.values(changeset[key]).some(x => x !== null)) { // collapse empty nodes empty nodes
                    changeset[key] = null;
                }
            }
            else if (targetProperty !== sourceProperty && sourceProperty !== undefined) {  // if not present in target, safely assign whole source.
                changeset[key] = sourceProperty;
            }
        }
        else if (targetProperty !== sourceProperty && sourceProperty !== undefined) {  // if value or array, just assign as is.
            changeset[key] = sourceProperty || null;
        }
    });

    Object.keys(target).forEach(key => {
        const targetProperty = target[key];
        const sourceProperty = source[key];

        if (targetProperty !== undefined && (sourceProperty === undefined || sourceProperty === null)) {
            changeset[key] = null;
        }
    });

    return changeset;
}