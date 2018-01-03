import { PageContract } from "@paperbits/common/pages/pageContract";
import { IPageService } from "@paperbits/common/pages/IPageService";
import { IPermalink } from "@paperbits/common/permalinks/IPermalink";
import { IHyperlinkProvider } from "@paperbits/common/ui/IHyperlinkProvider";
import { HyperlinkModel } from "@paperbits/common/permalinks/hyperlinkModel";
import { PagePermalinkResolver } from "@paperbits/common/pages/pagePermalinkResolver";
import { PageSelection } from '@paperbits/common/pages/pageSelection';
import { IPermalinkService } from "@paperbits/common/permalinks/IPermalinkService";


export class PageHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Pages";
    public readonly componentName = "page-selector";

    constructor(
        private readonly pageService: IPageService,
        private readonly permalinkService: IPermalinkService) {
    }

    public canHandleHyperlink(permalink: IPermalink): boolean {
        return permalink.targetKey.startsWith("pages/");
    }

    public getHyperlinkFromLinkable(page: PageContract): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = page.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = page.permalinkKey;
        hyperlinkModel.type = "page";

        return hyperlinkModel;
    }

    public async getHyperlinkFromPermalink(permalink: IPermalink, target: string): Promise<HyperlinkModel> {
        if (permalink.targetKey && permalink.targetKey.startsWith("pages/")) {
            const page = await this.pageService.getPageByKey(permalink.targetKey);

            let hyperlinkModel = new HyperlinkModel();
            hyperlinkModel.title = page.title;
            hyperlinkModel.target = target;
            hyperlinkModel.permalinkKey = permalink.key;
            hyperlinkModel.href = permalink.uri;
            hyperlinkModel.type = "page";

            return hyperlinkModel;
        }
        else if (permalink.parentKey) {
            const parentPermalink = await this.permalinkService.getPermalink(permalink.parentKey);
            const page = await this.pageService.getPageByKey(parentPermalink.targetKey);

            let anchorTitle = page.anchors[permalink.key.replaceAll("/", "|")];

            let hyperlinkModel = new HyperlinkModel();
            hyperlinkModel.title = `${page.title} > ${anchorTitle}`;
            hyperlinkModel.target = target;
            hyperlinkModel.permalinkKey = permalink.key;
            hyperlinkModel.href = permalink.uri;
            hyperlinkModel.type = "anchor";

            return hyperlinkModel;
        }

        return null;
    }

    public getHyperlinkFromResource(pageSelection: PageSelection): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = pageSelection.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = pageSelection.permalinkKey;
        hyperlinkModel.type = "page";

        return hyperlinkModel;
    }
}