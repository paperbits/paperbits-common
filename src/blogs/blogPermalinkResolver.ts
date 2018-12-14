// import { PermalinkContract } from "../permalinks/permalinkContract";
// import { IPermalinkResolver } from "../permalinks/IPermalinkResolver";
// import { IBlogService } from "./IBlogService";
// import { HyperlinkModel } from "../permalinks/hyperlinkModel";

// export class BlogPermalinkResolver implements IPermalinkResolver {
//     private readonly blogService: IBlogService;

//     constructor(blogService: IBlogService) {
//         this.blogService = blogService;
//     }

//     public async getUrlByContentItemKey(permalinkKey: string): Promise<string> {
//         const blogPost = await this.blogService.getBlogPostByKey(permalinkKey);

//         if (!blogPost) {
//             console.warn(`Permalink with key ${permalinkKey} not found.`);
//             return null;
//         }

//         return blogPost.permalink;
//     }

//     public async getUriByPermalink(permalink: PermalinkContract): Promise<string> {
//         return permalink.uri;
//     }

//     public async getHyperlinkByPermalink(permalink: PermalinkContract, target: string): Promise<HyperlinkModel> {
//         if (permalink.targetKey && permalink.targetKey.startsWith("posts/")) {
//             const post = await this.blogService.getBlogPostByKey(permalink.targetKey);

//             const hyperlinkModel = new HyperlinkModel();
//             hyperlinkModel.title = post.title;
//             hyperlinkModel.target = target;
//             hyperlinkModel.permalinkKey = permalink.key;
//             hyperlinkModel.href = permalink.uri;
//             hyperlinkModel.type = "post";

//             return hyperlinkModel;
//         }
//         // else if (permalink.parentKey) {
//         //     const parentPermalink = await this.permalinkService.getPermalinkByKey(permalink.parentKey);
//         //     const post = await this.blogService.getBlogPostByKey(parentPermalink.targetKey);

//         //     const anchorTitle = post.anchors[permalink.key.replaceAll("/", "|")];

//         //     const hyperlinkModel = new HyperlinkModel();
//         //     hyperlinkModel.title = anchorTitle;
//         //     hyperlinkModel.target = target;
//         //     hyperlinkModel.permalinkKey = permalink.key;
//         //     hyperlinkModel.href = permalink.uri;
//         //     hyperlinkModel.type = "post";

//         //     return hyperlinkModel;
//         // }

//         return null;
//     }
// }