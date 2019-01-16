import { LayoutContract } from "./layoutContract";
import { Contract } from "..";

export interface ILayoutService {
    search(pattern: string): Promise<LayoutContract[]>;

    getLayoutByKey(key: string): Promise<LayoutContract>;

    getLayoutByUriTemplate(permalinkTemplate: string): Promise<LayoutContract>;

    deleteLayout(layout: LayoutContract): Promise<void>;

    createLayout(title: string, description: string, permalinkTemplate: string): Promise<LayoutContract>;

    updateLayout(layout: LayoutContract): Promise<void>;

    getLayoutByRoute(routeTemplate: string): Promise<LayoutContract>;

    /**
     * Returns layout content by specified key.
     * @param layoutKey 
     */
    getLayoutContent(layoutKey: string): Promise<Contract>;

    /**
     * Updates layout content.
     * @param layoutKey {string} Key of the page.
     * @param document {Contract} Content of the page.
     */
    updateLayoutContent(layoutKey: string, document: Contract): Promise<void>;
}
