import { IModelBinder } from "../../editing/IModelBinder";
import { INavigationService } from "../../navigation/INavigationService";
import { IPermalinkService } from "../../permalinks/IPermalinkService";
import { NavbarModel } from "./navbarModel";
import { Contract } from "../../contract";
import { IWidgetBinding } from "../../editing/IWidgetBinding";
import { NavbarItemModel } from "./navbarItemModel";
import { NavigationItemContract } from "../../navigation/NavigationItemContract";
import { NavigationEvents } from "../../navigation/navigationEvents";
import { IViewModelBinder } from "./../IViewModelBinder";
import { IRouteHandler } from "../../routing/IRouteHandler";
import { IEventManager } from "../../events/IEventManager";
import { NavbarContract } from "./navbarContract";
import { IPermalinkResolver } from "../../permalinks/IPermalinkResolver";


export class NavbarModelBinder implements IModelBinder {
    constructor(
        private readonly navigationService: INavigationService,
        private readonly permalinkService: IPermalinkService,
        private readonly routeHandler: IRouteHandler,
        private readonly eventManager: IEventManager,
        private readonly permalinkResolver: IPermalinkResolver) {
    }

    public async nodeToModel(navbarContract: NavbarContract): Promise<NavbarModel> {
        const navbarModel = new NavbarModel();
        const navigationItemContract = await this.navigationService.getNavigationItem(navbarContract.rootKey);
        const currentUrl = this.routeHandler.getCurrentUrl();
        const navbarItemModel = await this.navigationItemToNavbarItemModel(navigationItemContract, currentUrl);

        navbarModel.root = navbarItemModel;
        navbarModel.rootKey = navbarContract.rootKey;
        navbarModel.pictureSourceKey = navbarContract.rootKey;

        if (navbarContract.pictureSourceKey) {
            try {
                navbarModel.pictureSourceUrl = await this.permalinkResolver.getUrlByPermalinkKey(navbarContract.pictureSourceKey);
                navbarModel.pictureSourceKey = navbarContract.pictureSourceKey;
            }
            catch (error) {
                console.log(error);
            }
        }

        return navbarModel;
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "navbar";
    }

    public canHandleModel(model): boolean {
        return model instanceof NavbarModel;
    }

    public async navigationItemToNavbarItemModel(navigationItemContract: NavigationItemContract, currentUrl: string): Promise<NavbarItemModel> {
        const navbarItem = new NavbarItemModel();

        navbarItem.label = navigationItemContract.label;

        if (navigationItemContract.navigationItems) {
            var tasks = [];

            navigationItemContract.navigationItems.forEach(child => {
                tasks.push(this.navigationItemToNavbarItemModel(child, currentUrl));
            });

            const results = await Promise.all(tasks);

            results.forEach(child => {
                navbarItem.nodes.push(child);
            });
        }
        else if (navigationItemContract.permalinkKey) {
            const permalink = await this.permalinkService.getPermalinkByKey(navigationItemContract.permalinkKey);
            const url = permalink ? permalink.uri : "";

            navbarItem.url = url.startsWith("/") ? url : "/" + url;
        }
        else if (navigationItemContract.externalUrl) {
            let url = navigationItemContract.externalUrl;
            navbarItem.url = url;
        }
        navbarItem.isActive = (navbarItem.url === currentUrl);

        return navbarItem;
    }

    public getConfig(navbarModel: NavbarModel): Contract {
        const navbarContract: NavbarContract = {
            object: "block",
            type: "navbar",
            rootKey: navbarModel.rootKey,
            pictureSourceKey: navbarModel.pictureSourceKey
        }

        return navbarContract;
    }
}