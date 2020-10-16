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
    targetKey?: string;

    /**
     * Indicates where the navigation link should open, e.g. _blank.
     */
    targetWindow?: string;

    /**
     * Child navigation items.
     */
    navigationItems?: NavigationItemContract[];
}