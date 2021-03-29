import { PopupContract } from "../popups/popupContract";
import { Query, Page } from "../persistence";
import { Contract } from "../contract";

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
    createPopup(title: string, description?: string): Promise<PopupContract>;

    /**
     * Updates a popup.
     */
    updatePopup(popup: PopupContract): Promise<void>;

    /**
     * Returns popup content by specified key.
     * @param popupKey {string} Unique popup identifier, e.g. `popups/1bbf57f8-8954-46bb-9c33-5b54643f9376`.
     * @param locale {string} Locale, e.g. `en-us`. If provided, operation returns content in specified locale.
     */
     getPopupContent(popupKey: string, locale?: string): Promise<Contract>;

    /**
     * Updates popup content.
     * @param popupKey {string} Key of the popup.
     * @param content {Contract} Contract describing content of the popup.
     * @param locale {string} Locale, e.g. `en-us`. If provided, operation updates content in specified locale.
     */
    updatePopupContent(popupKey: string, content: Contract, locale?: string): Promise<void>;
}
