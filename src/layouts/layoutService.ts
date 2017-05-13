import * as _ from 'lodash';
import * as Utils from '../core/utils';
import { IPermalink } from '../permalinks/IPermalink';
import { IFile } from '../files/IFile';
import { ILayout } from '../layouts/ILayout';
import { IObjectStorage } from '../persistence/IObjectStorage';
import { ILayoutService } from "./ILayoutService";

const layoutsPath = "layouts";

export class LayoutService implements ILayoutService {
    private readonly objectStorage: IObjectStorage;

    constructor(objectStorage: IObjectStorage) {
        this.objectStorage = objectStorage;
    }

    private async searchByTags(tags: Array<string>, tagValue: string, startAtSearch: boolean): Promise<Array<ILayout>> {
        return await this.objectStorage.searchObjects<ILayout>(layoutsPath, tags, tagValue, startAtSearch);
    }

    public async getLayoutByKey(key: string): Promise<ILayout> {
        return await this.objectStorage.getObject<ILayout>(key);
    }

    public search(pattern: string): Promise<Array<ILayout>> {
        return this.searchByTags(["title"], pattern, true);
    }

    public async deleteLayout(layout: ILayout): Promise<void> {
        var deleteContentPromise = this.objectStorage.deleteObject(layout.contentKey);
        var deleteLayoutPromise = this.objectStorage.deleteObject(layout.key);

        await Promise.all([deleteContentPromise, deleteLayoutPromise]);
    }

    public async createLayout(title: string, description: string, uriTemplate: string): Promise<ILayout> {
        var layoutId = `${layoutsPath}/${Utils.guid()}`;

        var layout: ILayout = {
            key: layoutId,
            title: title,
            description: description,
            uriTemplate: uriTemplate,
        };

        await this.objectStorage.addObject(layoutId, layout);

        return layout;
    }

    public async updateLayout(layout: ILayout): Promise<void> {
        await this.objectStorage.updateObject<ILayout>(layout.key, layout);
    }

    public async getLayoutByRoute(route: string): Promise<ILayout> {
        if (!route) {
            return null;
        }

        let layouts = await this.objectStorage.searchObjects<ILayout>(layoutsPath);

        if (layouts && layouts.length) {
            var filteredLayouts = layouts.filter((lyout: ILayout) => {
                var regExp = lyout.uriTemplate;
                return !!route.match(regExp);
            });

            if (filteredLayouts && filteredLayouts.length) {
                let layout: ILayout = _.maxBy(filteredLayouts, (item: ILayout) => { return item.uriTemplate.length });

                return layout;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
}
