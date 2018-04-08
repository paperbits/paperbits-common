import { HyperlinkModel } from "../../permalinks/hyperlinkModel";

export class ContentTableModel {
    title?: string;
    targetPermalinkKey: string;
    items: HyperlinkModel[];
}