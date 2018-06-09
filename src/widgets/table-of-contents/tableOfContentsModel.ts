import { NavigationItemModel } from "../../navigation/navigationItemModel";

export class TableOfContentsModel {
    title?: string;
    navigationItemKey?: string;
    items: NavigationItemModel[];
}