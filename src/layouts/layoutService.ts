import * as _ from "lodash";
import * as Utils from "../utils";
import { LayoutContract } from "../layouts/layoutContract";
import { IObjectStorage } from "../persistence";
import { ILayoutService } from "./";
import { Contract } from "..";

const layoutsPath = "layouts";
const documentsPath = "files";

export class LayoutService implements ILayoutService {
    constructor(private readonly objectStorage: IObjectStorage) { }

    private async searchByTags(tags: string[], tagValue: string, startAtSearch: boolean): Promise<LayoutContract[]> {
        return await this.objectStorage.searchObjects<LayoutContract>(layoutsPath, tags, tagValue, startAtSearch);
    }

    public async getLayoutByKey(key: string): Promise<LayoutContract> {
        return await this.objectStorage.getObject<LayoutContract>(key);
    }

    public search(pattern: string): Promise<LayoutContract[]> {
        return this.searchByTags(["title"], pattern, true);
    }

    public async deleteLayout(layout: LayoutContract): Promise<void> {
        const deleteContentPromise = this.objectStorage.deleteObject(layout.contentKey);
        const deleteLayoutPromise = this.objectStorage.deleteObject(layout.key);

        await Promise.all([deleteContentPromise, deleteLayoutPromise]);
    }

    public async createLayout(title: string, description: string, uriTemplate: string): Promise<LayoutContract> {
        const identifier = Utils.guid();
        const layoutKey = `${layoutsPath}/${identifier}`;
        const documentKey = `${documentsPath}/${identifier}`;

        const layout: LayoutContract = {
            key: layoutKey,
            title: title,
            description: description,
            uriTemplate: uriTemplate,
            contentKey: documentKey
        };

        const template = {
            object: "block",
            nodes: [{
                object: "block",
                type: "page"
            }],
            type: "layout"
        };

        await this.objectStorage.addObject(layoutKey, layout);
        await this.objectStorage.addObject(documentKey, template);

        return layout;
    }

    public async updateLayout(layout: LayoutContract): Promise<void> {
        await this.objectStorage.updateObject<LayoutContract>(layout.key, layout);
    }

    public async getLayoutByUriTemplate(uriTemplate: string): Promise<LayoutContract> {
        const layouts = await this.objectStorage.searchObjects<LayoutContract>(layoutsPath, ["uriTemplate"], uriTemplate);
        return layouts.length > 0 ? layouts[0] : null;
    }

    public async getLayoutByRoute(route: string): Promise<LayoutContract> {
        if (!route) {
            return null;
        }

        const layouts = await this.objectStorage.searchObjects<LayoutContract>(layoutsPath);

        if (layouts && layouts.length) {
            const layout = layouts.find((lyout: LayoutContract) => {
                return Utils.matchUrl(route, lyout.uriTemplate) !== undefined;
            });
            
            return layout || layouts.find(layout => layout.uriTemplate === "/");
        }
        else {
            return null;
        }
    }

    public async getLayoutContent(layoutKey: string): Promise<Contract> {
        const layout = await this.getLayoutByKey(layoutKey);
        return await this.objectStorage.getObject(layout.contentKey);
    }

    public async updateLayoutContent(layoutKey: string, document: Contract): Promise<void> {
        const layout = await this.getLayoutByKey(layoutKey);
        this.objectStorage.updateObject(layout.contentKey, document);
    }
}
