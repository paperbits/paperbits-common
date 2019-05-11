/**
 * Hyperlink model is used in editors to display an associated hyperlink.
 */
export class HyperlinkModel {
    /**
     * Example: "Page: Home"
     */
    public title: string;

    /**
     * Example: _blank.
     */
    public target: string;

    /**
     * Example: "pages/43i4394u3kn34j3h4gujhhfe444"
     */
    public targetKey?: string;

    /**
     * Example: "http://external-resource"
     */
    public href: string;

    /**
     * Example: "http://external-resource#anchor"
     */
    public anchor: string;
    
    /**
     * Example: "Anchor name"
     */
    public anchorName: string;
}