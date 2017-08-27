import * as Utils from "../../core/utils";
import { IViewModelBinder } from "./../IViewModelBinder";
import { AudioPlayerModel } from "./audioPlayerModel";
import { IWidgetBinding } from "./../../editing/IWidgetBinding";
import { IMediaService } from "../../media/IMediaService";
import { IAudioPlayerNode } from "./IAudioPlayerNode";
import { IPermalinkService } from "./../../permalinks/IPermalinkService";
import { IModelBinder } from "./../../editing/IModelBinder";

const DefaultSourceUrl = "http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v";

export class AudioPlayerModelBinder implements IModelBinder {
    private readonly permalinkService: IPermalinkService;
    private readonly mediaService: IMediaService;

    constructor(permalinkService: IPermalinkService, mediaService: IMediaService) {
        this.permalinkService = permalinkService;
        this.mediaService = mediaService;
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "audio-player";
    }

    public canHandleModel(model): boolean {
        return model instanceof AudioPlayerModel;
    }

    public async nodeToModel(audioNode: IAudioPlayerNode): Promise<AudioPlayerModel> {
        let audioModel = new AudioPlayerModel();
        audioModel.controls = audioNode.controls;
        audioModel.autoplay = audioNode.autoplay;
        if (audioNode.sourceKey) {
            audioModel.sourceKey = audioNode.sourceKey;

            let permalink = await this.permalinkService.getPermalinkByKey(audioNode.sourceKey);
            let media = await this.mediaService.getMediaByKey(permalink.targetKey);

            audioModel.sourceUrl = media.downloadUrl;
        }
        else if (audioNode.sourceUrl) {
            audioModel.sourceUrl = audioNode.sourceUrl;
        }
        else {
            // TODO: No default URL for audio player            
            audioModel.sourceUrl = DefaultSourceUrl;
        }
        return audioModel;
    }

    public getConfig(audioPlayerModel: AudioPlayerModel): IAudioPlayerNode {
        let audioConfig: IAudioPlayerNode = {
            kind: "block",
            type: "audio-player",
            sourceKey: audioPlayerModel.sourceKey,
            sourceUrl: audioPlayerModel.sourceUrl,
            controls: audioPlayerModel.controls,
            autoplay: audioPlayerModel.autoplay
        }

        return audioConfig;
    }
}