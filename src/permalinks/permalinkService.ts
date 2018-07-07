import * as Utils from "../utils";
import { IPermalinkService } from "../permalinks";
import { IObjectStorage } from "../persistence/IObjectStorage";
import { IPermalink } from "../permalinks/IPermalink";

const permalinksPath = "permalinks";

export class PermalinkService implements IPermalinkService {
    private readonly objectStorage: IObjectStorage;

    constructor(objectStorage: IObjectStorage) {
        this.objectStorage = objectStorage;
    }

    public async getPermalinkByUrl(uri: string): Promise<IPermalink> {
        const permalinks = await this.objectStorage.searchObjects<IPermalink>(permalinksPath, ["uri"], uri)

        if (permalinks.length > 0) {
            return permalinks[0];
        }
    }

    public async getPermalinkByKey(permalinkKey: string): Promise<IPermalink> {
        if (!permalinkKey) {
            throw new Error(`Could not retrieve permalink: Parameter "permalinkKey" was not specified.`);
        }

        const permalink = await this.objectStorage.getObject<IPermalink>(permalinkKey);

        if (!permalink) {
            console.warn(`Unable to find permalink by key ${permalinkKey}`);
        }

        return permalink;
    }

    public async createPermalink(uri: string, targetKey: string, parentKey?: string): Promise<IPermalink> {
        const permalinkKey = `${permalinksPath}/${Utils.guid()}`;

        const permalink: IPermalink = {
            key: permalinkKey,
            targetKey: targetKey,
            parentKey: parentKey,
            uri: uri
        };

        await this.objectStorage.addObject(permalinkKey, permalink);

        return permalink;
    }

    public async updatePermalink(permalink: IPermalink): Promise<void> {
        await this.objectStorage.updateObject(permalink.key, permalink);
    }

    public async deletePermalink(permalink: IPermalink): Promise<void> {
        await this.deletePermalinkByKey(permalink.key);
    }

    public async deletePermalinkByKey(permalinkKey: string): Promise<void> {
        await this.objectStorage.deleteObject(permalinkKey);
    }
}