import { IWidgetModel } from "../editing/IWidgetModel";
import { IModelBinder } from "../editing/IModelBinder";
import { IYoutubePlayerNode } from "./models/IYoutubePlayerNode";
import { YoutubePlayerModel } from "./models/youtubePlayerModel";


export class YoutubeModelBinder implements IModelBinder {
    constructor() {
        this.nodeToModel = this.nodeToModel.bind(this);
        this.modelToWidgetModel = this.modelToWidgetModel.bind(this);
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "youtube-player";
    }

    public canHandleWidgetModel(model): boolean {
        return model instanceof YoutubePlayerModel;
    }

    public async nodeToModel(youtubeNode: IYoutubePlayerNode): Promise<YoutubePlayerModel> {
        let youtubePlayerModel = new YoutubePlayerModel();

        youtubePlayerModel.videoId = youtubeNode.videoId;

        return youtubePlayerModel;
    }

    public async modelToWidgetModel(youtubePlayerModel: YoutubePlayerModel, readonly: boolean = false): Promise<IWidgetModel> {
        let widgetModel: IWidgetModel = {
            name: "paperbits-youtube-player",
            params: {},
            setupViewModel: (viewModel) => {
                if (viewModel.attachToModel) {
                    viewModel.attachToModel(youtubePlayerModel);
                }
            },
            nodeType: "youtube-player",
            model: youtubePlayerModel,
            //editor: "youtube-editor" // TODO: Youtube player has no editor so far
            readonly: readonly
        };

        return widgetModel;
    }

    public getConfig(youtubeModel: YoutubePlayerModel): IYoutubePlayerNode {
        let youtubeConfig: IYoutubePlayerNode = {
            kind: "block",
            type: "youtube-player",
            videoId: youtubeModel.videoId
        }

        return youtubeConfig;
    }
}