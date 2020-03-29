import { PageMetadata } from "./pageMetadata";

/**
 * Localized page.
 */
export interface LocalizedPageContract {
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
        [locale: string]: PageMetadata;
    };
}