import { IPermalink } from "./../permalinks/IPermalink";
import { IComponent } from "./IComponent";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";

export interface IHyperlinkProvider {
    name: string;
    componentName: string;
    canHandleHyperlink?(permalink: IPermalink): boolean;
    getHyperlinkFromUrl?(url: string, target?: string): HyperlinkModel;
    getHyperlinkFromPermalink?(permalink: IPermalink, target?: string): Promise<HyperlinkModel>;
    getHyperlinkFromResource(resource: any);
}