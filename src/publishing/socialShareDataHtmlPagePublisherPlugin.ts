import { HtmlPage } from "./htmlPage";
import { HtmlPagePublisherPlugin } from "./htmlPagePublisherPlugin";
import { IMediaService } from "../media";


export class SocialShareDataHtmlPagePublisherPlugin implements HtmlPagePublisherPlugin {
    constructor(private readonly mediaService: IMediaService) { }

    private appendLink(document: Document, rel: string, href: string): void {
        const canonicalLinkElement: HTMLStyleElement = document.createElement("link");
        canonicalLinkElement.setAttribute("rel", rel);
        canonicalLinkElement.setAttribute("href", href);
        document.head.appendChild(canonicalLinkElement);
    }

    public async apply(document: Document, page: HtmlPage): Promise<void> {
        if (!page.socialShareData?.imageSourceKey) {
            return;
        }

        const media = await this.mediaService.getMediaByKey(page.socialShareData.imageSourceKey);
        this.appendLink(document, "image_src", media.permalink);
    }
}
