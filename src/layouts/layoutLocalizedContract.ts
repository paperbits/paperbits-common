import { LayoutMetadata } from "./layoutMetadata";

export interface LayoutLocalizedContract {
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
        [locale: string]: LayoutMetadata;
    };
}