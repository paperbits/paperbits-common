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
     * Parameter used to define "target" attribute of hyperlink element. Allowed values: "blank", "blank", "self", "parent", "top".
     */
    target: string;
}