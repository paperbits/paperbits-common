import { IWidgetOrder } from "../editing/IWidgetOrder";

/**
 * Describes dropped content (file or URL).
 */
export interface IContentDescriptor {
    title: string;
    description: string;
    getWidgetOrder?(): Promise<IWidgetOrder>;
    getPreviewUrl?(): Promise<string>;
    getThumbnailUrl?(): Promise<string>;
    iconUrl?: string;
    uploadables?: (File | string)[];
}