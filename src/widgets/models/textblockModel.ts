import { IHtmlEditor } from "../../editing/IHtmlEditor";
import { IModel } from "./IModel";

export class TextblockModel implements IModel {
    public type: string = "text";
    public state: Object;
    public htmlEditor: IHtmlEditor;

    constructor(state: Object, htmlEditor?: IHtmlEditor) {
        this.state = state;
        this.htmlEditor = htmlEditor;
    }
}