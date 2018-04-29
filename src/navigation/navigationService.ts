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

    private find(items: NavigationItemContract[], key: string): NavigationItemContract {
        for (let i = 0; i < items.length; i++) {
            if (items[i].key == key) {
                return items[i];
            }
            else if (items[i].navigationItems) {
                const child = this.find(items[i].navigationItems, key);

                if (child) {
                    return child;
                }
            }
        }
    }

    public async getNavigationItem(navigationItemKey: string): Promise<NavigationItemContract> {
        const items = await this.getNavigationItems();

        return this.find(items, navigationItemKey);
    }

    public getNavigationItems(): Promise<Array<NavigationItemContract>> {
        return this.objectStorage.searchObjects<NavigationItemContract>(navigationItemsPath);
    }

    public async updateNavigationItem(navigationItem: NavigationItemContract): Promise<void> {
        const path = navigationItem.key;

        await this.objectStorage.updateObject(`${navigationItemsPath}/${path}`, navigationItem);

        this.eventManager.dispatchEvent(NavigationEvents.onNavigationItemUpdate, navigationItem);
    }

    public async updateNavigation(navigationItems: NavigationItemContract[]): Promise<void> {
        await this.objectStorage.updateObject(`${navigationItemsPath}`, navigationItems);

        navigationItems.forEach(navigationItem => {
            this.eventManager.dispatchEvent(NavigationEvents.onNavigationItemUpdate, navigationItem);
        })
    }
}