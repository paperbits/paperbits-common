import { PermalinkService } from "./permalinkService";
import { IPermalinkResolver, PermalinkContract } from "../permalinks";

export class DefaultPermalinkService implements PermalinkService {
    constructor(
        private readonly permalinkResolver: IPermalinkResolver,
        private readonly reservedPermalinks: string[]
    ) { }

    public async isPermalinkDefined(permalink: string): Promise<boolean> {
        if (!permalink) {
            return false;
        }

        if (this.reservedPermalinks.includes(permalink)) {
            return true;
        }

        const contentItem = await this.permalinkResolver.getContentItemByPermalink(permalink);

        return !contentItem;
    }

    public async getPermalink(uri: string): Promise<PermalinkContract> {
        const contentItem = await this.permalinkResolver.getContentItemByPermalink(uri);

        if (!contentItem) {
            return null;
        }

        const contract: PermalinkContract = { // TODO: Switch to DB when ready.
            key: "",
            uri: uri,
            targetKey: contentItem.key
        };

        return contract;
    }
}
