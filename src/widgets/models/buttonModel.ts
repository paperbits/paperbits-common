import { IModel } from "./IModel";
import { HyperlinkModel } from "../../permalinks/hyperlinkModel";

export class ButtonModel implements IModel {
    public type: string = "button";
    public label: string;
    public style: string;
    public size: string;
    public hyperlink: HyperlinkModel;

    constructor() {
        this.label = "Button";
        this.style = "default";
        this.size = "default";
    }
}
