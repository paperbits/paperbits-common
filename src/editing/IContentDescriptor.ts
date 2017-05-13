import { IWidgetOrder } from '../editing/IWidgetOrder';

export interface IContentDescriptor {
    title: string | KnockoutObservable<string>;
    description: string;
    getWidgetOrder?(): Promise<IWidgetOrder>;
    getPreviewUrl?(): Promise<string>;
    getThumbnailUrl?(): Promise<string>;
    iconUrl?: string;
    uploadables?: (File | string)[];
}