import { IContentDropHandler, IDataTransfer, IContentDescriptor } from "./";

export abstract class MediaHandlers implements IContentDropHandler {
    private mediaTypePrefixes: string[];
    private fileExtensions: string[];

    constructor(mediaTypePrefixes: string[], fileExtensions: string[]) {
        this.mediaTypePrefixes = mediaTypePrefixes;
        this.fileExtensions = fileExtensions;
    }

    protected matches(dataTransfer: IDataTransfer): boolean {
        if (dataTransfer.mimeType && !this.mediaTypePrefixes.some(m => dataTransfer.mimeType.startsWith(m))) {
            return false;
        }

        if (dataTransfer.name && !this.fileExtensions.some(e => dataTransfer.name.endsWith(e))) {
            return false;
        }

        return true;
    }

    public getContentDescriptorFromDataTransfer(item: IDataTransfer): IContentDescriptor {
        return null;
    }
}