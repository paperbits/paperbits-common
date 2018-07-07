import { NavigationItemContract } from "../navigation";

export interface INavigationService {
    /**
     * Return navigation item by key
     * @param navigationItemKey
     */
    getNavigationItem(navigationItemKey: string): Promise<NavigationItemContract>;

    /**
     * Updates specified navigation item in storage.
     * @param navigationItem Navigation item contract.
     */
    updateNavigationItem(navigationItem: NavigationItemContract): Promise<void>;

    /**
     * Returns top-level navigation items.
     */
    getNavigationItems(): Promise<NavigationItemContract[]>;

    /**
     * Updates multple navigation items.
     * @param navigationItems Array of navigation items.
     */
    updateNavigation(navigationItems: NavigationItemContract[]): Promise<void>;
}