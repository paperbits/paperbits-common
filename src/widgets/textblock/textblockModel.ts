import { IHtmlEditor } from "../../editing/IHtmlEditor";


export class TextblockModel {
    public type: string = "text";
    public state: Object;
    public htmlEditor: IHtmlEditor;

    constructor(state: Object) {
        this.state = state;
    }

    private onChange(): void {
        this.state = this.htmlEditor.getState();
    }
}