import { IHtmlEditor } from "../../editing/IHtmlEditor";
import { IModel } from "./IModel";

export class TextblockModel implements IModel {
    public type: string = "text";
    public state: Object;
    public htmlEditor: IHtmlEditor;

    constructor(state: Object) {
        this.state = state;
        // htmlEditor.addSelectionChangeListener(this.onChange.bind(this));
    }

    private onChange(): void {
        this.state = this.htmlEditor.getState();
    }
}