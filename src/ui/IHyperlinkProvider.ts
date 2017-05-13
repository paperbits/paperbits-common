import { IPermalink } from "./../permalinks/IPermalink";
import { IComponent } from "./IComponent";
import { HyperlinkModel } from "../permalinks/hyperlinkModel";

export interface IHyperlinkProvider {
    name: string;
    componentName: string;
    canHandleResource?(resource: string): boolean;
    getHyperlinkFromUrl?(url: string, target?: string): HyperlinkModel;
    getHyperlinkFromPermalink?(permalink: IPermalink, target?: string): Promise<HyperlinkModel>;
    getHyperlinkFromResource<T>(resource: T);
}