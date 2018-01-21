import { IObjectStorage } from '../persistence/IObjectStorage';
import { IEventManager } from '../events/IEventManager';
import { INavigationService } from '../navigation/INavigationService';
import { NavigationItemContract } from '../navigation/NavigationItemContract';
import { NavigationEvents } from '../navigation/navigationEvents';

const navigationItemsPath = "navigationItems";

export class NavigationService implements INavigationService {
    private readonly eventManager: IEventManager;
    private readonly objectStorage: IObjectStorage;

    constructor(eventManager: IEventManager, objectStorage: IObjectStorage) {
        this.eventManager = eventManager;
        this.objectStorage = objectStorage;

        // rebinding....
        this.getNavigationItem = this.getNavigationItem.bind(this);
    }

    public getNavigationItem(navigationItemKey: string): Promise<NavigationItemContract> {
        return this.objectStorage.getObject<NavigationItemContract>(navigationItemKey);
    }

    public getNavigationItems(): Promise<Array<NavigationItemContract>> {
        return this.objectStorage.searchObjects<NavigationItemContract>(navigationItemsPath);
    }

    public async updateNavigationItem(navigationItem: NavigationItemContract): Promise<void> {
        var path = navigationItem.key;

        await this.objectStorage.updateObject(path, navigationItem);
        
        this.eventManager.dispatchEvent(NavigationEvents.onNavigationItemUpdate, navigationItem);
    }
}