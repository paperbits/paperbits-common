import * as _ from 'lodash';
import * as Utils from '../utils';
import { IPermalink } from '../permalinks/IPermalink';
import { LayoutContract } from '../layouts/layoutContract';
import { IObjectStorage } from '../persistence/IObjectStorage';
import { ILayoutService } from "./ILayoutService";

const layoutsPath = "layouts";

export class LayoutService implements ILayoutService {
    private readonly objectStorage: IObjectStorage;

    constructor(objectStorage: IObjectStorage) {
        this.objectStorage = objectStorage;
    }

    private async searchByTags(tags: Array<string>, tagValue: string, startAtSearch: boolean): Promise<Array<LayoutContract>> {
        return await this.objectStorage.searchObjects<LayoutContract>(layoutsPath, tags, tagValue, startAtSearch);
    }

    public async getLayoutByKey(key: string): Promise<LayoutContract> {
        return await this.objectStorage.getObject<LayoutContract>(key);
    }

    public search(pattern: string): Promise<Array<LayoutContract>> {
        return this.searchByTags(["title"], pattern, true);
    }

    public async deleteLayout(layout: LayoutContract): Promise<void> {
        let deleteContentPromise = this.objectStorage.deleteObject(layout.contentKey);
        let deleteLayoutPromise = this.objectStorage.deleteObject(layout.key);

        await Promise.all([deleteContentPromise, deleteLayoutPromise]);
    }

    public async createLayout(title: string, description: string, uriTemplate: string): Promise<LayoutContract> {
        let layoutId = `${layoutsPath}/${Utils.guid()}`;

        let layout: LayoutContract = {
            key: layoutId,
            title: title,
            description: description,
            uriTemplate: uriTemplate,
        };

        await this.objectStorage.addObject(layoutId, layout);

        return layout;
    }

    public async updateLayout(layout: LayoutContract): Promise<void> {
        await this.objectStorage.updateObject<LayoutContract>(layout.key, layout);
    }

    public async getLayoutByUriTemplate(uriTemplate: string): Promise<LayoutContract> {
        let layouts = await this.objectStorage.searchObjects<LayoutContract>(layoutsPath, ["uriTemplate"], uriTemplate);
        return layouts.length > 0 ? layouts[0] : null;
    }

    public async getLayoutByRoute(route: string): Promise<LayoutContract> {
        if (!route) {
            return null;
        }

        let layouts = await this.objectStorage.searchObjects<LayoutContract>(layoutsPath);

        if (layouts && layouts.length) {
            let filteredLayouts = layouts.filter((lyout: LayoutContract) => {
                let regExp = lyout.uriTemplate;
                return !!route.match(regExp);
            });

            if (filteredLayouts && filteredLayouts.length) {
                let layout: LayoutContract = _.maxBy(filteredLayouts, (item: LayoutContract) => { return item.uriTemplate.length });

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
