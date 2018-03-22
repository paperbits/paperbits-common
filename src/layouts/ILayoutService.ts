import { LayoutContract } from '../layouts/layoutContract';

export interface ILayoutService {
    search(pattern: string): Promise<Array<LayoutContract>>;

    getLayoutByKey(key: string): Promise<LayoutContract>;

    getLayoutByUriTemplate(uriTemplate: string): Promise<LayoutContract>

    deleteLayout(layout: LayoutContract): Promise<void>;

    createLayout(title: string, description: string, uriTemplate:string): Promise<LayoutContract>;

    updateLayout(layout: LayoutContract): Promise<void>;

    getLayoutByRoute(routeTemplate: string): Promise<LayoutContract>;
}
