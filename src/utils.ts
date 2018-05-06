import { ProgressPromise } from './progressPromise';
import { Object } from 'es6-shim';
import { fail } from 'assert';

export interface IFunctionBag {
    (): void;
    add(item: () => void): IFunctionBag;
}

export function createFunctionBag(): IFunctionBag {
    var items: (() => void)[] = [];

    var bag = <IFunctionBag>function () {
        for (var i = 0; i < items.length; i++) {
            items[i]();
        }
    };
    bag.add = (item): IFunctionBag => {
        items.push(item);
        return bag;
    };

    return bag;
}

export function guid(): string {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
        s4() + "-" + s4() + s4() + s4();
}

export function identifier() {
    var result = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        result += possible.charAt(Math.floor(Math.random() * possible.length));

    return result;
}

export function createComponent(nodeName: string, attributes: Object): HTMLElement {
    var htmlElement = document.createElement(nodeName);
    htmlElement.style.width = "200px";
    Object.keys(attributes).forEach(key => htmlElement.setAttribute(key, attributes[key]));

    ko.applyBindings({}, htmlElement); // VK: Required to force component view model creation and binding.

    return htmlElement;
}

export function downloadFile(url: string): ProgressPromise<Uint8Array> {
    return new ProgressPromise<Uint8Array>((resolve, reject, progress) => {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "arraybuffer";
        xhr.onprogress = progressEventToProgress(percent => progress(percent));
        xhr.onload = () => resolve(new Uint8Array(xhr.response));
        xhr.open('GET', url);
        xhr.send();
    });
}

export function arrayBufferToBase64(buffer: Uint8Array) {
    if (Buffer) {
        return new Buffer(buffer).toString('base64');
    }
    else {
        var binary = "";
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
}

export function readFileAsByteArray(file: File): ProgressPromise<Uint8Array> {
    return new ProgressPromise<Uint8Array>((resolve, reject, progress) => {
        let reader = new FileReader();
        reader.onload = event => resolve((<any>event.target).result);
        reader.onprogress = progressEventToProgress(progress);
        reader.readAsArrayBuffer(file);
    });
}

export function readBlobAsDataUrl(blob: Blob): ProgressPromise<string> {
    return readDataUrlFromReader(reader => reader.readAsDataURL(blob));
}

function readDataUrlFromReader(read: (reader: FileReader) => void): ProgressPromise<string> {
    return new ProgressPromise<string>((resolve, reject, progress) => {
        let reader = new FileReader();
        reader.onload = event => resolve((<any>event.target).result);
        reader.onprogress = progressEventToProgress(progress);
        read(reader);
    });
}

function progressEventToProgress(progress: (precent: number) => void): (event: ProgressEvent) => void {
    return (event: ProgressEvent) => {
        if (event.lengthComputable) {
            let percentLoaded = Math.round((event.loaded / event.total) * 100);
            progress(percentLoaded);
        }
    };
}

export function isDirectUrl(url: string): boolean {
    return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:");
}

export interface ILazy<T> {
    (): T;
}

export function lazy<T>(factory: () => T): ILazy<T> {
    let value: T;
    let evaluated = false;
    return () => {
        if (evaluated) {
            return value;
        }
        evaluated = true;
        return value = factory();
    }
}

export function getCookie(name: string) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

export function stringToUnit8Array(content: string): Uint8Array {
    var escstr = encodeURIComponent(content);

    var binstr = escstr.replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode(<any>('0x' + p1));
    });

    var bytes = new Uint8Array(binstr.length);

    Array.prototype.forEach.call(binstr, (ch, i) => {
        bytes[i] = ch.charCodeAt(0);
    });

    return bytes;
}

export function uint8ArrayToString(bytes: Uint8Array): string {
    const binstr = Array.prototype.map.call(bytes, (ch) => { return String.fromCharCode(ch); }).join('');

    const content = binstr.replace(/(.)/g, (m, p) => {
        var code = p.charCodeAt(p).toString(16).toUpperCase();

        if (code.length < 2) {
            code = '0' + code;
        }
        return '%' + code;
    });

    return decodeURIComponent(content);
}

/**
 * Remove all properties with undefined value from object.
 */
export function cleanupObject(source: Object): void {
    if (source instanceof Object) {
        Object.keys(source).forEach(key => {
            const child = source[key];

            if (child instanceof Object) {
                this.cleanupObject(child);
            }
            else if (child === undefined) {
                delete source[key];
            }
        });
    }
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
    return item !== undefined && (item && typeof item === 'object' && !Array.isArray(item));
}

export function mergeDeepAt(path: String, target: any, source: any) {
    let updatingObject = this.setStructure(path, target);

    if (Array.isArray(source)) {
        this.setValue(path, target, source);
    }
    else {
        updatingObject = this.mergeDeep(updatingObject, source);
        this.setValue(path, target, updatingObject);
    }
}
/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, source) {
    if (!isObject(target)) {
        return JSON.parse(JSON.stringify(source));
    }

    const output = Object.assign({}, target);

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = mergeDeep(target[key], source[key]);
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

export function intersectDeepMany(target, nonObjectHandler: (target: any, source: any, key: string) => any, ...sources: any[]) {
    let result = target;
    sources.forEach(source => {
        result = this.intersectDeep(result, nonObjectHandler, source);
    })
    return result;
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function intersectDeep(target, nonObjectHandler: (target: any, source: any, key: string) => any, source: any) {
    let output: any = null;
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if ((key in target)) {
                    const intersection = intersectDeep(target[key], nonObjectHandler, source[key]);
                    if (intersection && Object.keys(intersection).length > 0) {
                        output = output || {};
                        output[key] = intersection;
                    }
                }
            } else {
                if (nonObjectHandler) {
                    const value = nonObjectHandler(target, source, key);
                    if (value !== undefined) {
                        output = output || {};
                        output[key] = value;
                    }
                }
            }
        });
    }
    return output;
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function complementDeep(target: any, treatEmptyAsComplete: boolean, source): any {
    let output = {};
    if (isObject(target) && isObject(source)) {
        Object.keys(target).forEach(key => {
            if (!(key in source)) {
                Object.assign(output, { [key]: target[key] });
            } else if (isObject(target[key])) {
                const value = complementDeep(target[key], treatEmptyAsComplete, source[key]);
                if (value) {
                    output[key] = value;
                }
            }
        });
    } else if (isObject(target)) {
        if (!treatEmptyAsComplete) {
            Object.keys(target).forEach(key => {
                Object.assign(output, { [key]: target[key] });
            });
        }
    }
    if (isObject(output) && Object.keys(output).length === 0) {
        return null;
    }
    return output;
}

export function setStructure(path: string, target: Object, delimiter: string = "/"): Object {
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

export function replace(path: string, target: Object, value: any, delimiter: string = "/"): Object {
    target = JSON.parse(JSON.stringify(target))
    const segments = path.split(delimiter);
    let segmentObject = target;
    let segment: string;
    let parent: any = target;

    segments.forEach(s => {
        if (!segmentObject[s]) {
            segmentObject[s] = {};
        }
        parent = segmentObject;
        segmentObject = segmentObject[s];
        segment = s;
    });

    if (segment) {
        parent[segment] = value;
    }
    return target;
}

export function setValue(path: string, target: Object, value: any): void {
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

export function getObjectAt<T>(path: string, source: Object, delimiter: string = "/"): T {
    if (typeof path !== "string") {
        return null;
    }
    if (typeof source !== "object") {
        return null;
    }
    const segments = path.split(delimiter);
    let segmentObject = source;

    for (var i = 0; i < segments.length; i++) {
        segmentObject = segmentObject[segments[i]];

        if (!segmentObject) {
            return null;
        }
    }

    return <T>segmentObject;
}

export function findNodesRecursively(predicate: (x: Object) => boolean, source: Object): Object[] {
    const result = [];

    if (predicate(source)) {
        result.push(source);
    }

    const keys = Object.keys(source); // This includes array keys

    keys.forEach(key => {
        const child = source[key];

        if (child instanceof Object) {
            const childResult = findNodesRecursively(predicate, child);
            result.push.apply(result, childResult);
        }
    });

    return result;
}

export function elementsFromPoint(ownerDocument: Document, x: number, y: number): HTMLElement[] {
    if (ownerDocument.elementsFromPoint) {
        return Array.prototype.slice.call(ownerDocument.elementsFromPoint(Math.floor(x), Math.floor(y)));
    }
    else if (ownerDocument.msElementsFromPoint) {
        return Array.prototype.slice.call(ownerDocument.msElementsFromPoint(Math.floor(x), Math.floor(y)));
    }
    else {
        throw `Method "elementsFromPoint" not supported by browser.`
    }
}

export function leaves(source: any, ignoreRoot: boolean = true): any[] {
    let output = [];

    const q = [];
    if (!isObject(source)) {
        return output;
    }
    let keys = Object.keys(source);

    if (keys.length === 0) {
        if (ignoreRoot === false) {
            output.push(source);
        }
        return output;
    }

    let node: any = source;

    keys.map(key => ({ key, node })).forEach(i => q.push(i));

    let iterator = q.pop();
    while (iterator) {
        const node = iterator.node[iterator.key];

        if (!isObject(node)) {
            if (q.length > 0) {
                iterator = q.pop();
                continue;
            } else {
                return output;
            }
        }

        if (node.fullId) {
            output.push(node);
        } else {
            Object.keys(node).map(key => ({ key, node })).forEach(i => q.push(i));
        }

        iterator = q.pop();
    }

    return output;
}