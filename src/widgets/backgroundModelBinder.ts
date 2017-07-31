import { IModelBinder } from "../editing/IModelBinder";
import { ContentConfig } from "../editing/contentNode";
import { BackgroundModel } from "./models/backgroundModel";
import { BackgroundContract } from "../ui/draggables/backgorund";
import { IPermalinkResolver } from "../permalinks/IPermalinkResolver";

export class BackgroundModelBinder {
    private readonly permalinkResolver: IPermalinkResolver;

    constructor(permalinkResolver: IPermalinkResolver) {
        this.permalinkResolver = permalinkResolver;
    }

    public async nodeToModel(contract: BackgroundContract): Promise<BackgroundModel> {
        let model = new BackgroundModel();

        if (contract.color) {
            model.colorKey = contract.color;
        }

        if (contract.size) {
            model.size = contract.size;
        }

        if (contract.position) {
            model.position = contract.position;
        }

        if (contract.picture) {
            model.sourceType = "picture";
            model.sourceKey = contract.picture.sourcePermalinkKey;
            model.sourceUrl = await this.permalinkResolver.getUriByPermalinkKey(contract.picture.sourcePermalinkKey);
        }

        return model;
    }
}