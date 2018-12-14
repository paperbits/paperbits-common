// import { PermalinkContract, IPermalinkResolver, IPermalinkService } from "../permalinks";
// import { IMediaService } from "./IMediaService";
// import { HyperlinkModel } from "../permalinks/hyperlinkModel";

// const DefaultSourceUrl = "http://placehold.it/800x600";

// export class MediaPermalinkResolver implements IPermalinkResolver {
//     constructor(private readonly mediaService: IMediaService) { }

//     public async getUrlByContentItemKey(contentItemKey: string): Promise<string> {
//         const mediaContract = await this.mediaService.getMediaByKey(contentItemKey);

//         if (!mediaContract) {
//             console.warn(`Permalink with key ${contentItemKey} not found.`);
//             return null;
//         }

//         return mediaContract.permalink;
//     }

//     public async getUriByPermalink(permalink: PermalinkContract): Promise<string> {
//         if (!permalink.targetKey) {
//             return null;
//         }

//         const media = await this.mediaService.getMediaByKey(permalink.targetKey);

//         if (media) {
//             return media.downloadUrl;
//         }
//         else {
//             console.warn(`Media file with key ${permalink.targetKey} not found, setting default image.`);

//             return DefaultSourceUrl;
//         }
//     }

//     public async getHyperlinkByPermalink(permalink: PermalinkContract, target: string): Promise<HyperlinkModel> {
//         if (!permalink.targetKey) {
//             return null;
//         }

//         const media = await this.mediaService.getMediaByKey(permalink.targetKey);

//         if (!media) {
//             return null;
//         }

//         const hyperlinkModel = new HyperlinkModel();
//         hyperlinkModel.title = media.filename;
//         hyperlinkModel.target = target;
//         hyperlinkModel.permalinkKey = permalink.key;
//         hyperlinkModel.href = permalink.uri;
//         hyperlinkModel.type = "media";

//         return hyperlinkModel;
//     }
// }