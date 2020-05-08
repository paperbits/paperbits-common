/**
 * Contract describing hyperlink.
 */
export interface HyperlinkContract {
    /**
     * Key of permalink that is used to define "href" attribute of hyperlink element.
     */
    targetKey?: string;

    /**
     * Parameter used to define anchor of hyperlink element.
     */
    anchor?: string;

    /**
     * Display name of the anchor (temporary field, should be calculated).
     */
    anchorName?: string;

    /**
     * Parameter used to define "target" attribute of hyperlink element. Allowed values: "_blank", "_self", "_parent".
     */
    target: string;
}