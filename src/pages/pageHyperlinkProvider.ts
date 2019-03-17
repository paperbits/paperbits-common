import { IHyperlinkProvider } from "../ui/IHyperlinkProvider";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";


export class PageHyperlinkProvider implements IHyperlinkProvider {
    public readonly name: string = "Pages";
    public readonly componentName = "page-selector";

    public canHandleHyperlink(contentItemKey: string): boolean {
        return contentItemKey.startsWith("pages/");
    }

    public getHyperlinkFromResource(hyperlinkModel: HyperlinkModel): HyperlinkModel {
        return hyperlinkModel;
    }
}