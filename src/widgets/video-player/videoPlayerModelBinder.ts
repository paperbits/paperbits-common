import { IViewModelBinder } from "./../IViewModelBinder";
import * as Utils from '../../core/utils';
import { VideoPlayerModel } from "./videoPlayerModel";
import { IWidgetBinding } from "../../editing/IWidgetBinding";
import { IPermalinkService } from "../../permalinks/IPermalinkService";
import { IMediaService } from "../../media/IMediaService";
import { IVideoPlayerNode } from "./IVideoPlayerNode";
import { IModelBinder } from "../../editing/IModelBinder";


const DefaultSourceUrl = "http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v";

export class VideoPlayerModelBinder implements IModelBinder {
    private readonly permalinkService: IPermalinkService;
    private readonly mediaService: IMediaService;

    constructor(permalinkService: IPermalinkService, mediaService: IMediaService) {
        this.permalinkService = permalinkService;
        this.mediaService = mediaService;
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "video-player";
    }

    public canHandleModel(model): boolean {
        return model instanceof VideoPlayerModel;
    }

    public async nodeToModel(videoPlayerNode: IVideoPlayerNode): Promise<VideoPlayerModel> {
        let videoPlayerModel = new VideoPlayerModel();
        videoPlayerModel.controls = videoPlayerNode.controls;
        videoPlayerModel.autoplay = videoPlayerNode.autoplay;

        if (videoPlayerNode.sourceKey) {
            videoPlayerModel.sourceKey = videoPlayerNode.sourceKey;

            let permalink = await this.permalinkService.getPermalinkByKey(videoPlayerNode.sourceKey)

            if (!permalink) {
                console.warn(`Permalink with key ${videoPlayerNode.sourceKey} not found.`);
            }
            else {
                let media = await this.mediaService.getMediaByKey(permalink.targetKey);

                if (media) {
                    videoPlayerModel.sourceUrl = media.downloadUrl;
                }
                else {
                    // videoPlayerModel.sourceUrl = DefaultSourceUrl
                    console.warn(`Media file with key ${permalink.targetKey} not found, setting default image.`);
                }
            }
        }
        else if (videoPlayerNode.sourceUrl) {
            videoPlayerModel.sourceUrl = videoPlayerNode.sourceUrl;
        }
        else {
            videoPlayerModel.sourceUrl = DefaultSourceUrl;
        }

        return videoPlayerModel;
    }

    public getConfig(videoPlayerModel: VideoPlayerModel): IVideoPlayerNode {
        let videoConfig: IVideoPlayerNode = {
            kind: "block",
            type: "video-player",
            sourceKey: videoPlayerModel.sourceKey,
            controls: videoPlayerModel.controls,
            autoplay: videoPlayerModel.autoplay
        }

        return videoConfig;
    }
}