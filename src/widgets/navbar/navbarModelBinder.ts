import { IModelBinder } from "../../editing/IModelBinder";
import { INavigationService } from "../../navigation/INavigationService";
import { IPermalinkService } from "../../permalinks/IPermalinkService";
import { NavbarModel } from "./navbarModel";
import { Contract } from "../../editing/contentNode";
import { IWidgetBinding } from "../../editing/IWidgetBinding";
import { NavbarItemModel } from "./navbarItemModel";
import { INavigationItem } from "../../navigation/INavigationItem";
import { NavigationEvents } from "../../navigation/navigationEvents";
import { IViewModelBinder } from "./../IViewModelBinder";
import { IRouteHandler } from "../../routing/IRouteHandler";
import { IEventManager } from "../../events/IEventManager";


export class NavbarModelBinder implements IModelBinder {
    private readonly navigationService: INavigationService;
    private readonly permalinkService: IPermalinkService;
    private readonly eventManager: IEventManager;
    private readonly routeHandler: IRouteHandler;

    constructor(navigationService: INavigationService, permalinkService: IPermalinkService, routeHandler: IRouteHandler, eventManager: IEventManager) {
        this.navigationService = navigationService;
        this.permalinkService = permalinkService;
        this.eventManager = eventManager;
        this.routeHandler = routeHandler;

        this.nodeToModel = this.nodeToModel.bind(this);
        this.navigationItemToNavbarItemModel = this.navigationItemToNavbarItemModel.bind(this);
    }

    public async nodeToModel(node: Contract): Promise<NavbarModel> { //node = INavbar
        let model = new NavbarModel();
        let rootKey = node["rootKey"];
        let navigationItem = await this.navigationService.getNavigationItem(node["rootKey"]);
        let currentUrl = this.routeHandler.getCurrentUrl();
        let navbarItem = await this.navigationItemToNavbarItemModel(navigationItem, currentUrl);
        model.root = navbarItem;
        model.rootKey = rootKey;
        model.align = node.align;

        return model;
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "navbar";
    }

    public canHandleModel(model): boolean {
        return model instanceof NavbarModel;
    }

    public async navigationItemToNavbarItemModel(navItem: INavigationItem, currentUrl:string): Promise<NavbarItemModel> {
        let navbarItem = new NavbarItemModel();

        navbarItem.label = navItem.label;

        if (navItem.navigationItems) {
            var tasks = [];

            navItem.navigationItems.forEach(child => {
                tasks.push(this.navigationItemToNavbarItemModel(child, currentUrl));
            });

            let results = await Promise.all(tasks);

            results.forEach(child => {
                navbarItem.nodes.push(child);
            });
        }
        else if (navItem.permalinkKey) {
            let permalink = await this.permalinkService.getPermalinkByKey(navItem.permalinkKey);
            let url = permalink ? `/${permalink.uri}` : "";

            navbarItem.url = url;
        }
        else if (navItem.externalUrl) {
            let url = navItem.externalUrl;
            navbarItem.url = url;
        }
        navbarItem.isActive = (navbarItem.url === currentUrl);

        return navbarItem;
    }

    public getConfig(model: NavbarModel): Contract {
        let navbarConfig: Contract = {
            kind: "block",
            type: "navbar",
            rootKey: model.rootKey,
            align: model.align
        }

        return navbarConfig;
    }
}