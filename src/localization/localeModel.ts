export interface LocaleModel {
    /**
     * Own key.
     */
    key: string;

    /**
     * Locale code, e.g. "en-us".
     */
    code: string;

    /**
     * Direction of the text, e.g. `ltr`, `rtl`.
     */
    direction?: string;

    /**
     * Locale display name, e.g. English (US). 
     */
    displayName: string;
}