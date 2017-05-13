import { INavigationItem } from '../navigation/INavigationItem';

export interface INavigationService {
    getNavigationItem(navigationItemKey: string): Promise<INavigationItem>;
    updateNavigationItem(navigationItem: INavigationItem): Promise<void>;
    getNavigationItems(): Promise<Array<INavigationItem>>;
}