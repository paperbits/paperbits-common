import { IMedia } from "./../media/IMedia";
import { IMediaService } from "./../media/IMediaService";
import { IBlobStorage } from "./../persistence/IBlobStorage";
import { IPermalinkService } from "./../permalinks/IPermalinkService";
import { IHttpClient } from "./../http/IHttpClient";
import { IPublisher } from './IPublisher';

export class MediaPublisher implements IPublisher {
    private readonly httpClient: IHttpClient;
    private readonly permalinkService: IPermalinkService;
    private readonly outputBlobStorage: IBlobStorage;
    private readonly mediaService: IMediaService

    constructor(httpClient: IHttpClient, mediaService: IMediaService, permalinkService: IPermalinkService, outputBlobStorage: IBlobStorage) {
        this.httpClient = httpClient;
        this.mediaService = mediaService;
        this.permalinkService = permalinkService;
        this.outputBlobStorage = outputBlobStorage;

        this.publish = this.publish.bind(this);
        this.renderMediaFile = this.renderMediaFile.bind(this);
        this.renderMedia = this.renderMedia.bind(this);
    }

    private async renderMediaFile(mediaFile: IMedia): Promise<void> {
        let permalink = await this.permalinkService.getPermalinkByKey(mediaFile.permalinkKey);
        let response = await this.httpClient.send({ url: mediaFile.downloadUrl });

        await this.outputBlobStorage.uploadBlob(permalink.uri, response.toByteArray());
    }

    private async renderMedia(mediaFiles: Array<IMedia>): Promise<void> {
        let mediaPromises = new Array<Promise<void>>();

        mediaFiles.forEach(mediaFile => {
            console.log(`Publishing media ${mediaFile.filename}...`);
            mediaPromises.push(this.renderMediaFile(mediaFile));
        });

        await Promise.all(mediaPromises);
    }

    public async publish(): Promise<void> {
        let mediaFiles = await this.mediaService.search();
        await this.renderMedia(mediaFiles);
    }
}
