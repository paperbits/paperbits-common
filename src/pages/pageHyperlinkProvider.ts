import { PageContract } from "../pages/pageContract";
import { IHyperlinkProvider } from "../ui/IHyperlinkProvider";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";


export class PageHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Pages";
    public readonly componentName = "page-selector";

    public canHandleHyperlink(contentItemKey: string): boolean {
        return contentItemKey.startsWith("pages/");
    }

    public getHyperlinkFromResource(page: PageContract): HyperlinkModel {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = page.title;
        hyperlinkModel.target = "_blank";
        hyperlinkModel.targetKey = page.key;
        hyperlinkModel.type = "page";

        return hyperlinkModel;
    }
}