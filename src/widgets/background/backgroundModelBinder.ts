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

        if (contract.picture && contract.picture.sourceKey) {
            model.sourceType = "picture";
            model.sourceKey = contract.picture.sourceKey;
            model.sourceUrl = await this.permalinkResolver.getUrlByTargetKey(contract.picture.sourceKey);
        }

        return model;
    }
}