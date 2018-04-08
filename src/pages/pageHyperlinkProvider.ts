import { PageContract } from "../pages/pageContract";
import { IPermalink } from "../permalinks/IPermalink";
import { IHyperlinkProvider } from "../ui/IHyperlinkProvider";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";


export class PageHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Pages";
    public readonly componentName = "page-selector";

    public canHandleHyperlink(permalink: IPermalink): boolean {
        return permalink.targetKey.startsWith("pages/");
    }

    public getHyperlinkFromResource(page: PageContract): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = page.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.permalinkKey = page.permalinkKey;
        hyperlinkModel.type = "page";

        return hyperlinkModel;
    }
}