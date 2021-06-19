export class NavigationItemModel {
    /**
     * Unique identifier.
     */
    public key?: string;

    /**
     * Label.
     */
    public label?: string;

    /**
     * Target key.
     */
    public targetKey?: string;

    /**
     * Target URL.
     */
    public targetUrl?: string;

    /**
     * Indicates where the navigation link should open, e.g. _blank.
     */
    public targetWindow?: string;

    /**
     * Event that triggers the navigation, e.g. `click`.
     */
    public triggerEvent?: string;

    /**
     * Parameter used to define anchor of hyperlink element.
     */
    public anchor?: string;

    /**
     * Child navigation items.
     */
    public nodes?: NavigationItemModel[];

    /**
     * Indicates if item should be highlighted as actve.
     */
    public isActive?: boolean;

    /**
     * Level in navigation tree.
     */
    public level?: number;

    constructor() {
        this.nodes = [];
    }
}
