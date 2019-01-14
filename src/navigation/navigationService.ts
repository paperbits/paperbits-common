import { Bag } from "./../bag";
import { IObjectStorage } from "../persistence";
import { IEventManager } from "../events";
import { INavigationService } from "../navigation";
import { NavigationItemContract } from "../navigation/navigationItemContract";
import { NavigationEvents } from "../navigation/navigationEvents";

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
        for (const item of items) {
            if (item.key === key) {
                return item;
            }
            else if (item.navigationItems) {
                const child = this.find(item.navigationItems, key);

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

    public async getNavigationItems(): Promise<NavigationItemContract[]> {
        const result = await this.objectStorage.searchObjects<Bag<NavigationItemContract>>(navigationItemsPath);
        return Object.keys(result).map(key => result[key]);
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
        });
    }
}