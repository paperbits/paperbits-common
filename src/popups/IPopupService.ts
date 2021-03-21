import { PopupContract } from "../popups/popupContract";
import { Query, Page } from "../persistence";

/**
 * Service for managing popups.
 */
export interface IPopupService {
    /**
     * Searches for popups that contain specified pattern in their title, description or keywords.
     */
    search(query: Query<PopupContract>): Promise<Page<PopupContract>>;

    /**
     * Returns a popup by specified key;
     */
    getPopupByKey(key: string, locale?: string): Promise<PopupContract>;

    /**
     * Deletes a specified popup from storage.
     */
    deletePopup(popup: PopupContract): Promise<void>;

    /**
     * Creates new popup in storage and returns a contract of it.
     */
    createPopup(permalink: string, title: string, description?: string): Promise<PopupContract>;

    /**
     * Updates a popup.
     */
    updatePopup(popup: PopupContract): Promise<void>;
}
