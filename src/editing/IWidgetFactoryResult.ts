import { ICreatedMedia } from "./../media/ICreatedMedia";

export interface IWidgetFactoryResult {
    element: HTMLElement;
    onMediaUploadedCallback?(media: ICreatedMedia);
}