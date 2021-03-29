import { PopupMetadata } from "./popupMetadata";

/**
 * Page.
 */
export interface PopupLocalizedContract {
    /**
     * Own key.
     */
    key: string;

    /**
     * Page locales.
     */
    locales: {
        /**
         * e.g. "en-us".
         */
        [locale: string]: PopupMetadata;
    };
}