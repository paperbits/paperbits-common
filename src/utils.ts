import { Quadrant } from "./ui";
import { Breakpoints } from ".";
import * as deepmerge from "deepmerge";
import { Query } from "./persistence";


export function guid(): string {
    function s4(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
        s4() + "-" + s4() + s4() + s4();
}

export function identifier(): string {
    let result = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
        result += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return result;
}

export function randomClassName(): string {
    let result = "";
    const possible = "abcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < 10; i++) {
        result += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return result;
}

export function downloadFile(url: string): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "arraybuffer";
        xhr.onload = () => resolve(new Uint8Array(xhr.response));
        xhr.open("GET", url);
        xhr.send();
    });
}

export function arrayBufferToBase64(buffer: Uint8Array): string {
    if (Buffer) {
        return Buffer.from(buffer).toString("base64");
    }
    else {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;

        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
}

export function base64ToArrayBuffer(base64: string): Uint8Array {
    const buffer = Buffer.from(base64, "base64");
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < buffer.length; ++i) {
        uint8Array[i] = buffer[i];
    }
    return uint8Array;
}

export function readFileAsByteArray(file: File): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve((<any>event.target).result);
        reader.readAsArrayBuffer(file);
    });
}

export function readBlobAsDataUrl(blob: Blob): Promise<string> {
    return readDataUrlFromReader(reader => reader.readAsDataURL(blob));
}

export function readDataUrlFromReader(read: (reader: FileReader) => void): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve((<any>event.target).result);
        read(reader);
    });
}

export function progressEventToProgress(progress: (precent: number) => void): (event: ProgressEvent) => void {
    return (event: ProgressEvent) => {
        if (event.lengthComputable) {
            const percentLoaded = Math.round((event.loaded / event.total) * 100);
            progress(percentLoaded);
        }
    };
}

export function isDirectUrl(url: string): boolean {
    return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:");
}

export function getCookie(name: string): string {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");

    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
}

export function stringToUnit8Array(content: string): Uint8Array {
    const escstr = encodeURIComponent(content);

    const binstr = escstr.replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode(<any>("0x" + p1));
    });

    const bytes = new Uint8Array(binstr.length);

    Array.prototype.forEach.call(binstr, (ch, i) => {
        bytes[i] = ch.charCodeAt(0);
    });

    return bytes;
}

export function uint8ArrayToString(bytes: Uint8Array): string {
    const encodedString = String.fromCharCode.apply(null, bytes);
    const decodedString = decodeURIComponent(escape(encodedString));

    return decodedString;
}

export function intersectDeepMany(target, nonObjectHandler: (target: any, source: any, key: string) => any, ...sources: any[]) {
    let result = target;
    sources.forEach(source => {
        result = this.intersectDeep(result, nonObjectHandler, source);
    });
    return result;
}

export function replace(path: string, target: object, value: any, delimiter: string = "/"): object {
    target = JSON.parse(JSON.stringify(target));
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

export function assign(target, source) {
    Object.assign(target, deepmerge(target, source));
}

export function findNodesRecursively(predicate: (x: object) => boolean, source: object): object[] {
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
    if (!x || !y) {
        return [];
    }

    if (ownerDocument.elementsFromPoint) {
        return Array.prototype.slice.call(ownerDocument.elementsFromPoint(Math.floor(x), Math.floor(y)));
    }
    else if (ownerDocument["msElementsFromPoint"]) {
        return Array.prototype.slice.call(ownerDocument["msElementsFromPoint"](Math.floor(x), Math.floor(y)));
    }
    else {
        throw new Error(`Method "elementsFromPoint" not supported by browser.`);
    }
}

export function slugify(text: string): string {
    return text.toString().toLowerCase().trim()
        .replace(/[^\w\s-]/g, "") // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
        .replace(/[\s_-]+/g, "-") // swap any length of whitespace, underscore, hyphen characters with a single _
        .replace(/^-+|-+$/g, ""); // remove leading, trailing -
}

export function pointerToClientQuadrant(pointerX: number, pointerY: number, element: HTMLElement): Quadrant {
    const rect = element.getBoundingClientRect();
    const clientX = pointerX - rect.left;
    const clientY = pointerY - rect.top;

    let vertical;
    let horizontal;

    if (clientX > rect.width / 2) {
        horizontal = "right";
    }
    else {
        horizontal = "left";
    }

    if (clientY > rect.height / 2) {
        vertical = "bottom";
    }
    else {
        vertical = "top";
    }

    return { vertical: vertical, horizontal: horizontal };
}

export function optimizeBreakpoints(breakpoints: Breakpoints<any>): Breakpoints<any> {
    const result: Breakpoints<any> = {};
    let lastAssigned = null;
    const breakpointKeys = ["xs", "sm", "md", "lg", "xl"];

    breakpointKeys.forEach(breakpoint => {
        const value = breakpoints[breakpoint];

        if (value && value !== lastAssigned) {
            result[breakpoint] = value;
            lastAssigned = value;
        }
    });

    const resultKeys = Object.keys(result);

    if (resultKeys.length === 1) {
        const singleKey = resultKeys[0];
        return result[singleKey];
    }

    return result;
}

export function getClosestBreakpoint(source: Breakpoints<any>, current: string): string {
    const breakpoints = ["xs", "sm", "md", "lg", "xl"];
    let index = breakpoints.indexOf(current);
    let breakpoint = null;

    do {
        breakpoint = breakpoints[index];
        index--;
    }
    while (!source[breakpoint] && index >= 0);

    return breakpoint;
}

export function camelCaseToKebabCase(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase().replace(/\s/g, "-");
}

export function getUrlHashPart(urlPath: string): string {
    if (urlPath.indexOf("#") !== -1) {
        return urlPath.split("#")[1];
    }
    return undefined;
}

export function matchUrl(urlPath: string, urlTemplate: string): { index: number, name: string, value?: string }[] {
    if (urlPath.charAt(0) === "/") {
        urlPath = urlPath.slice(1);
    }
    if (urlTemplate.charAt(0) === "/") {
        urlTemplate = urlTemplate.slice(1);
    }

    if (urlPath.charAt(urlPath.length - 1) === "/") {
        urlPath = urlPath.slice(0, -1);
    }
    if (urlTemplate.charAt(urlTemplate.length - 1) === "/") {
        urlTemplate = urlTemplate.slice(0, -1);
    }

    const pathSegments = urlPath.split("/");

    const templateSegments = urlTemplate.split("/");
    if (pathSegments.length !== templateSegments.length && urlTemplate.indexOf("*") === -1) {
        return undefined;
    }

    const tokens: { index: number, name: string, value?: string }[] = [];

    templateSegments.filter((t, index) => {
        if (t.charAt(0) === "{") {
            tokens.push({ index: index, name: t.replace(/{|}/g, "") });
        }
    });

    for (let i = 0; i < templateSegments.length; i++) {
        const segment = pathSegments[i];
        const token = tokens.find(t => t.index === i);

        if (!token && (segment === templateSegments[i] || templateSegments[i] === "*")) {
            if (templateSegments[i] === "*") {
                return tokens;
            }

            continue;
        }
        else {
            if (token) {
                const hashIndex = segment.indexOf("#");
                if (hashIndex === 0) {
                    token.value = segment.substring(1);
                } else {
                    if (hashIndex > 0) {
                        return undefined;
                    } else {
                        token.value = segment;
                    }
                }
            } else {
                if (templateSegments.length - 1 - i <= 1 && segment.indexOf("#") > 0) {
                    tokens.push({ index: -1, name: "#", value: segment.split("#")[1] });
                    return tokens;
                }
                return undefined;
            }
        }
    }

    return tokens;
}

export function closest(node: Node, predicate: (node: Node) => boolean): Node {
    do {
        if (predicate(node)) {
            return node;
        }
    }
    while (node = node && node.parentNode);
}

export function localizeQuery<T>(query: Query<T>, locale: string): Query<T> {
    const localizedQuery = query.copy();
    localizedQuery.filters.forEach(x => x.left = `locales/${locale}/${x.left}`);

    if (localizedQuery.orderingBy) {
        localizedQuery.orderingBy = `locales/${locale}/${localizedQuery.orderingBy}`;
    }

    return localizedQuery;
}

export function delay(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export function ensureLeadingSlash(url: string = ""): string {
    return url.startsWith("/") ? url : `/${url}`;
}

export function ensureTrailingSlash(url: string = ""): string {
    return url.endsWith("/") ? url : `${url}/`;
}
