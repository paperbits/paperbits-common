/**
 * Data structure describing a navigation items, e.g. menus.
 */
export interface NavigationItemContract {
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
     * Child navigation items.
     */
    navigationItems?: NavigationItemContract[];
}