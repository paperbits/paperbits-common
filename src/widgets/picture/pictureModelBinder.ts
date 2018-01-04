import { IViewModelBinder } from "./../IViewModelBinder";
import { ModelBinderSelector } from "./../modelBinderSelector";
import { PictureModel } from "./pictureModel";
import { PictureContract } from "./pictureContract";
import { IWidgetBinding } from "./../../editing/IWidgetBinding";
import { IModelBinder } from "./../../editing/IModelBinder";
import { IPermalinkResolver } from "../../permalinks/IPermalinkResolver";
import { BackgroundModel } from "../background/backgroundModel";


export class PictureModelBinder implements IModelBinder {
    private readonly permalinkResolver: IPermalinkResolver;

    constructor(permalinkResolver: IPermalinkResolver) {
        this.permalinkResolver = permalinkResolver;
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "picture";
    }

    public canHandleModel(model): boolean {
        return model instanceof PictureModel;
    }

    public async nodeToModel(pictureNode: PictureContract): Promise<PictureModel> {
        let pictureModel = new PictureModel();
        pictureModel.caption = pictureNode.caption;
        pictureModel.layout = pictureNode.layout;
        pictureModel.animation = pictureNode.animation ? pictureNode.animation : "none";
        pictureModel.background = new BackgroundModel();

        if (pictureNode.sourceKey) {
            try {
                pictureModel.background.sourceUrl = await this.permalinkResolver.getUriByPermalinkKey(pictureNode.sourceKey);
                pictureModel.background.sourceKey = pictureNode.sourceKey;
            }
            catch (error) {
                console.log(error);
            }
        }

        return pictureModel;
    }

    public getConfig(pictureModel: PictureModel): PictureContract {
        let pictureContract: PictureContract = {
            kind: "block",
            type: "picture",
            caption: pictureModel.caption,
            animation: pictureModel.animation,
            layout: pictureModel.layout
        }

        if (pictureModel.background) {
            pictureContract.sourceKey = pictureModel.background.sourceKey;
        }

        return pictureContract;
    }
}