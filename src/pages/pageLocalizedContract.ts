import { PageMetadata } from "./pageMetadata";

/**
 * Page.
 */
export interface PageLocalizedContract {
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