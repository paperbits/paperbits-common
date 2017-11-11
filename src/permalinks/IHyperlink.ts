/**
 * Structure describing hyperlink element.
 */
export interface IHyperlink {
    /**
     * Key of permalink that is used to define "href" attribute of hyperlink element.
     */
    permalinkKey?: string;

    /**
     * Technically, we should always use only permalinks, even for external URLs;
     */
    href?: string;

    /**
     * Parameter used to define "target" attribute of hyperlink element. Allowed values: "blank", "blank", "self", "parent", "top".
     */
    target: string;
}