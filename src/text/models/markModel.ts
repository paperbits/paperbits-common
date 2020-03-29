import { HyperlinkModel } from "../../permalinks";
import { ColorModel } from "./colorModel";

export class MarkModel {
    public attrs?: HyperlinkModel | ColorModel;
    
    constructor(public readonly type: string) { }
}
