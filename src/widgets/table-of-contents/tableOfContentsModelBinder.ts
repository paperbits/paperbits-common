import { IPermalinkService } from "./../../permalinks/IPermalinkService";
import { IPageService } from "./../../pages/IPageService";
import { Contract } from "./../../contract";
import { IModelBinder } from "../../editing/IModelBinder";
import { TableOfContentsModel } from "./tableOfContentsModel";
import { HyperlinkModel } from "../../permalinks/hyperlinkModel";
import { TableOfContentsContract } from "./../table-of-contents";
import { INavigationService, NavigationItemContract } from "@paperbits/common/navigation";
import { IRouteHandler } from "../../routing";
import { NavbarItemModel } from "../navbar";
import { IPermalink } from "@paperbits/common/permalinks";


export class TableOfContentsModelBinder implements IModelBinder {
    constructor(
        private readonly pageService: IPageService,
        private readonly permalinkService: IPermalinkService,
        private readonly navigationService: INavigationService,
        private readonly routeHandler: IRouteHandler
    ) {
        this.nodeToModel = this.nodeToModel.bind(this);
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "table-of-contents";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof TableOfContentsModel;
    }

    private async processAnchorItems(permalink: IPermalink, anchors): Promise<NavbarItemModel[]> {
        const anchorPromises = Object.keys(anchors).map(async anchorKey => {
            const permalinkKey = anchorKey.replaceAll("|", "/");
            const anchorPermalink = await this.permalinkService.getPermalink(permalinkKey);

            const anchorNavbarItem = new NavbarItemModel();
            anchorNavbarItem.label = anchors[anchorKey]; //`${page.title} > ${page.anchors[anchorKey]}`;
            // nchorNavbarItem.url = `${permalink.uri}#${anchorPermalink.uri}`;
            anchorNavbarItem.url = `#${anchorPermalink.uri}`;

            return anchorNavbarItem;
        });

        const results = await Promise.all(anchorPromises);

        return results;
    }

    private async processNavigationItem(navigationItem: NavigationItemContract, currentPageUrl: string): Promise<NavbarItemModel> {
        const permalink = await this.permalinkService.getPermalinkByKey(navigationItem.permalinkKey);

        const navbarItemModel = new NavbarItemModel();
        navbarItemModel.label = navigationItem.label;
        navbarItemModel.url = permalink.uri;

        if (permalink.uri === currentPageUrl) {
            navbarItemModel.isActive = true;

            const page = await this.pageService.getPageByKey(permalink.targetKey);

            if (page.anchors) {
                navbarItemModel.nodes = await this.processAnchorItems(permalink, page.anchors);
            }
        }

        return navbarItemModel;
    }

    public async nodeToModel(tableOfContentsContract: TableOfContentsContract): Promise<TableOfContentsModel> {
        const type = "table-of-contents";

        const tableOfContentsModel = new TableOfContentsModel();
        tableOfContentsModel.title = tableOfContentsContract.title;
        tableOfContentsModel.navigationItemKey = tableOfContentsContract.navigationItemKey;
        tableOfContentsModel.items = [];

        const currentPageUrl = this.routeHandler.getCurrentUrl();
        const currentPagePermalink = await this.permalinkService.getPermalinkByUrl(currentPageUrl);
        const page = await this.pageService.getPageByKey(currentPagePermalink.targetKey);

        if (tableOfContentsContract.navigationItemKey) {
            const assignedNavigationItem = await this.navigationService.getNavigationItem(tableOfContentsContract.navigationItemKey);

            if (assignedNavigationItem.navigationItems) { // has child nav items
                const promises = assignedNavigationItem.navigationItems.map(async navigationItem => {
                    return await this.processNavigationItem(navigationItem, currentPageUrl);
                })

                const results = await Promise.all(promises);

                tableOfContentsModel.items = results;
            }
            else {
                const permalink = await this.permalinkService.getPermalinkByKey(assignedNavigationItem.permalinkKey);

                if (permalink.uri === currentPageUrl) {
                    if (page.anchors) {
                        const anchors = await this.processAnchorItems(currentPagePermalink, page.anchors);
                        tableOfContentsModel.items = anchors;
                    }
                }
            }
        }
        else {
            if (page.anchors) {
                const anchors = await this.processAnchorItems(currentPagePermalink, page.anchors);
                tableOfContentsModel.items = anchors;
            }
        }

        return tableOfContentsModel;
    }

    public getConfig(tableOfContentsModel: TableOfContentsModel): Contract {
        const tableOfContentsConfig: TableOfContentsContract = {
            object: "block",
            type: "table-of-contents",
            title: tableOfContentsModel.title,
            navigationItemKey: tableOfContentsModel.navigationItemKey
        };

        return tableOfContentsConfig;
    }
}
