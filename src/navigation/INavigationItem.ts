/**
 * Data structure describing a navigation items like menus.
 */
export interface INavigationItem {
    /**
     * Own key.
     */
    key: string;

    /**
     * Navigation item label.
     */
    label: string;

    /**
     * Key of a permalink referencing resource this navigation item is pointing to.
     */
    permalinkKey?: string;

    /**
     * URL to external resource this navigation item is pointing to.
     */
    externalUrl?: string;

    /**
     * Child navigation items.
     */
    navigationItems?: Array<INavigationItem>;
}