import { IHtmlEditor } from "../editing";
import { IEventManager } from "../events";

export interface IHtmlEditorProvider {
    getCurrentHtmlEditor(): IHtmlEditor;
}

export class HtmlEditorProvider implements IHtmlEditorProvider {
    private htmlEditor: IHtmlEditor;

    constructor(eventManager: IEventManager) {
        this.getCurrentHtmlEditor = this.getCurrentHtmlEditor.bind(this);
        this.setCurrentHtmlEditor = this.setCurrentHtmlEditor.bind(this);

        eventManager.addEventListener("htmlEditorChanged", this.setCurrentHtmlEditor);
    }

    private setCurrentHtmlEditor(htmlEditor: IHtmlEditor): void {
        this.htmlEditor = htmlEditor;
    }

    public getCurrentHtmlEditor(): IHtmlEditor {
        return this.htmlEditor;
    }
}
