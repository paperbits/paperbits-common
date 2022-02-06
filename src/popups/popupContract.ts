import { PopupMetadata } from "./popupMetadata";
import { ContentItemContract } from "../contentModel";


/**
 * Popup metadata.
 */
 export interface PopupContract extends PopupMetadata, ContentItemContract {
    /**
     * Own key.
     */
    key?: string;
}