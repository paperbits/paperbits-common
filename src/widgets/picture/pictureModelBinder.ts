import { IViewModelBinder } from "./../IViewModelBinder";
import { ModelBinderSelector } from "./../modelBinderSelector";
import { PictureModel } from "./pictureModel";
import { PictureContract } from "./pictureContract";
import { IWidgetBinding } from "./../../editing/IWidgetBinding";
import { IModelBinder } from "./../../editing/IModelBinder";
import { IPermalinkResolver } from "../../permalinks/IPermalinkResolver";
import { BackgroundModel } from "../background/backgroundModel";


export class PictureModelBinder implements IModelBinder {
    constructor(private readonly permalinkResolver: IPermalinkResolver) { }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "picture";
    }

    public canHandleModel(model): boolean {
        return model instanceof PictureModel;
    }

    public async nodeToModel(pictureContract: PictureContract): Promise<PictureModel> {
        let pictureModel = new PictureModel();
        pictureModel.caption = pictureContract.caption;
        pictureModel.layout = pictureContract.layout;
        pictureModel.animation = pictureContract.animation ? pictureContract.animation : "none";
        pictureModel.background = new BackgroundModel();

        if (pictureContract.sourceKey) {
            try {
                pictureModel.background.sourceUrl = await this.permalinkResolver.getUrlByPermalinkKey(pictureContract.sourceKey);
                pictureModel.background.sourceKey = pictureContract.sourceKey;
            }
            catch (error) {
                console.log(error);
            }
        }

        return pictureModel;
    }

    public getConfig(pictureModel: PictureModel): PictureContract {
        let pictureContract: PictureContract = {
            object: "block",
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