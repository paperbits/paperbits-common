/**
 * Contract describing hyperlink.
 */
export interface HyperlinkContract {
    /**
     * Parameter used to define anchor of hyperlink element.
     */
    anchor?: string;

    /**
     * @deprecated. Display name of the anchor (temporary field, should be calculated).
     */
    anchorName?: string;

    /**
     * Parameter used to define "target" attribute of hyperlink element. Allowed values: "_blank", "_self", "_parent".
     */
    target: string; // => targetWindow

    /**
     * Key of permalink that is used to define "href" attribute of hyperlink element.
     */
    targetKey?: string;

    /**
     * Event that triggers the navigation, e.g. `click`.
     */
    triggerEvent?: string;
}