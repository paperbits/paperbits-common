import { IObjectStorage } from "../persistence";
import { INavigationService } from "../navigation";
import { NavigationItemContract } from "../navigation/navigationItemContract";

const navigationItemsPath = "navigationItems";

export class NavigationService implements INavigationService {
    constructor(private readonly objectStorage: IObjectStorage) { }

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
        const result = await this.objectStorage.getObject<NavigationItemContract>(navigationItemsPath);
        return result ? Object.values(result) : [];
    }

    public async updateNavigation(navigationItems: NavigationItemContract[]): Promise<void> {
        await this.objectStorage.updateObject(`${navigationItemsPath}`, navigationItems);
    }
}