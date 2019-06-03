import { MediaContract } from "./../media";
import { IWidgetBinding } from "./IWidgetBinding";


export interface IWidgetFactoryResult<TModel> {
    /**
     * HTML element created by widget order (element is used only in virtual dragging).
     */
    element: HTMLElement;

    /**
     * Widget model created by widget order.
     */
    widgetModel?: Object;

    /**
     * Widget binding created by widget order.
     */
    widgetBinding?: IWidgetBinding<TModel>;

    /**
     * Callback method invoked when media file upload completed.
     */
    onMediaUploadedCallback?(media: MediaContract): void;
}