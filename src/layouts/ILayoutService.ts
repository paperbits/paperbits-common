import { IFile } from '../files/IFile';
import { ILayout } from '../layouts/ILayout';

export interface ILayoutService {
    search(pattern: string): Promise<Array<ILayout>>;

    getLayoutByKey(key: string): Promise<ILayout>;

    deleteLayout(layout: ILayout): Promise<void>;

    createLayout(title: string, description: string, uriTemplate:string): Promise<ILayout>;

    updateLayout(layout: ILayout): Promise<void>;

    getLayoutByRoute(routeTemplate: string): Promise<ILayout>;
}
