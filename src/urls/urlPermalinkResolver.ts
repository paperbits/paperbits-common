// import { PermalinkContract } from "../permalinks/permalinkContract";
// import { IPermalinkResolver } from "../permalinks/IPermalinkResolver";
// import { IPermalinkService } from "../permalinks";
// import { IUrlService } from "./IUrlService";
// import { HyperlinkModel } from "../permalinks/hyperlinkModel";


// export class UrlPermalinkResolver implements IPermalinkResolver {
//     private readonly permalinkService: IPermalinkService;
//     private readonly urlService: IUrlService;

//     constructor(permalinkService: IPermalinkService, urlService: IUrlService) {
//         this.permalinkService = permalinkService;
//         this.urlService = urlService;
//     }

//     public async getUrlByContentItemKey(permalinkKey: string): Promise<string> {
//         if (!contentItemKey) {
//             throw new Error("Permalink key cannot be null or empty.");
//         }

//         const contentItem = await this.contentItemService.getContentItemByKey(contentItemKey);

//         if (!contentItem) {
//             throw new Error(`Could not find permalink with key ${contentItemKey}.`);
//         }

//         return contentItem.permalink;
//     // }

//     // public async getUriByPermalink(permalink: PermalinkContract): Promise<string> {
//     //     return permalink.uri;
//     // }

//     public async getHyperlinkByPermalink(permalink: PermalinkContract, target: string): Promise<HyperlinkModel> {
//         if (permalink.targetKey && permalink.targetKey.startsWith("urls/")) {
//             const url = await this.urlService.getUrlByKey(permalink.targetKey);

//             const hyperlinkModel = new HyperlinkModel();
//             hyperlinkModel.title = url.title;
//             hyperlinkModel.target = target;
//             hyperlinkModel.permalinkKey = permalink.key;
//             hyperlinkModel.href = permalink.uri;
//             hyperlinkModel.type = "url";

//             return hyperlinkModel;
//         }

//         return null;
//     }
// }