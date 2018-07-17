import { BackgroundModel } from "./backgroundModel";
import { BackgroundContract } from "../../ui/background";
import { IPermalinkResolver } from "../../permalinks";

export class BackgroundModelBinder {
    private readonly permalinkResolver: IPermalinkResolver;

    constructor(permalinkResolver: IPermalinkResolver) {
        this.permalinkResolver = permalinkResolver;
    }

    public async contractToModel(contract: BackgroundContract): Promise<BackgroundModel> {
        const model = new BackgroundModel();

        if (contract.color) {
            model.colorKey = contract.color;
        }

        if (contract.size) {
            model.size = contract.size;
        }

        if (contract.position) {
            model.position = contract.position;
        }

        if (contract.picture && contract.picture.sourcePermalinkKey) {
            model.sourceType = "picture";
            model.sourceKey = contract.picture.sourcePermalinkKey;
            model.sourceUrl = await this.permalinkResolver.getUrlByPermalinkKey(contract.picture.sourcePermalinkKey);
        }

        return model;
    }
}