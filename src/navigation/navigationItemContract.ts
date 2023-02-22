import { Contract } from "../contract";

/**
 * Data structure describing a navigation items, e.g. menus.
 */
export interface NavigationItemContract extends Contract {
    /**
     * Own key.
     */
    key: string;

    /**
     * Navigation item label, e.g. `About`.
     */
    label: string;

    /**
     * Key of a permalink referencing resource this navigation item is pointing to, e.g. `pages/a4095a4c-5147-1596-23b4-bd77a6c5f6dc`.
     */
    targetKey?: string;

    /**
     * Indicates where the navigation link should open, e.g. `_blank`.
     */
    targetWindow?: string;

    /**
     * Child navigation items.
     */
    navigationItems?: NavigationItemContract[];

    /**
     * Parameter used to define anchor of hyperlink element, e.g. `myanchor`.
     */
    anchor?: string;

    /**
     * Event that triggers the navigation, e.g. `click`.
     */
    triggerEvent?: string;
}