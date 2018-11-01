import * as Utils from "../utils";
import { PermalinkContract, IPermalinkService } from "../permalinks";
import { IObjectStorage } from "../persistence";

const permalinksPath = "permalinks";

export class PermalinkService implements IPermalinkService {
    private readonly objectStorage: IObjectStorage;

    constructor(objectStorage: IObjectStorage) {
        this.objectStorage = objectStorage;
    }

    public async getPermalinkByUrl(uri: string): Promise<PermalinkContract> {
        const permalinks = await this.objectStorage.searchObjects<PermalinkContract>(permalinksPath, ["uri"], uri)

        if (permalinks.length > 0) {
            return permalinks[0];
        }
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
            parentKey: parentKey,
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