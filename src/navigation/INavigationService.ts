import { NavigationItemContract } from '../navigation/navigationItemContract';

export interface INavigationService {
    getNavigationItem(navigationItemKey: string): Promise<NavigationItemContract>;
    updateNavigationItem(navigationItem: NavigationItemContract): Promise<void>;
    getNavigationItems(): Promise<Array<NavigationItemContract>>;
    updateNavigation(navigationItems: NavigationItemContract[]): Promise<void>;
}