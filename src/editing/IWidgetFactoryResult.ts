import { ICreatedMedia } from "./../media/ICreatedMedia";

export interface IWidgetFactoryResult {
    element: HTMLElement;
    widgetModel?: Object;
    onMediaUploadedCallback?(media: ICreatedMedia);
}