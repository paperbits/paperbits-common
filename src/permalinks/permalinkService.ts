import * as Utils from "../utils";
import { PermalinkContract, IPermalinkService } from "./";
import { IObjectStorage, Operator, Query } from "../persistence";

const permalinksPath = "permalinks";

export class PermalinkService implements IPermalinkService {
    constructor(private readonly objectStorage: IObjectStorage) { }

    public async getPermalinkByUrl(uri: string): Promise<PermalinkContract> {
        const query = Query
            .from<PermalinkContract>()
            .where("uri", Operator.equals, uri);

        const result = await this.objectStorage.searchObjects<PermalinkContract>(permalinksPath, query);
        const permalinks = Object.keys(result).map(key => result[key]);

        return permalinks.length > 0 ? permalinks[0] : null;
    }

    public async getPermalinkByKey(permalinkKey: string): Promise<PermalinkContract> {
        if (!permalinkKey) {
            throw new Error(`Could not retrieve permalink: Parameter "permalinkKey" was not specified.`);
        }

        const permalink = await this.objectStorage.getObject<PermalinkContract>(permalinkKey);

        if (!permalink) {
            console.warn(`Unable to find permalink by key ${permalinkKey}`);
        }

        return permalink;
    }

    public async createPermalink(uri: string, targetKey: string, parentKey?: string): Promise<PermalinkContract> {
        const permalinkKey = `${permalinksPath}/${Utils.guid()}`;

        const permalink: PermalinkContract = {
            key: permalinkKey,
            targetKey: targetKey,
            uri: uri
        };

        await this.objectStorage.addObject(permalinkKey, permalink);

        return permalink;
    }

    public async updatePermalink(permalink: PermalinkContract): Promise<void> {
        await this.objectStorage.updateObject(permalink.key, permalink);
    }

    public async deletePermalink(permalink: PermalinkContract): Promise<void> {
        await this.deletePermalinkByKey(permalink.key);
    }

    public async deletePermalinkByKey(permalinkKey: string): Promise<void> {
        await this.objectStorage.deleteObject(permalinkKey);
    }
}