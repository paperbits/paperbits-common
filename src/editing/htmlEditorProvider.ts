import { IHtmlEditor, formattableStates } from '../editing/IHtmlEditor';
import { IEventManager } from '../events/IEventManager';

export interface IHtmlEditorProvider {
    getCurrentHtmlEditor(): IHtmlEditor;
}

export class HtmlEditorProvider implements IHtmlEditorProvider {
    private htmlEditor: IHtmlEditor;

    constructor(eventManager: IEventManager) {
        eventManager.addEventListener("htmlEditorChanged", (htmlEditor) => { this.htmlEditor = htmlEditor; });
        this.getCurrentHtmlEditor = this.getCurrentHtmlEditor.bind(this);
    }

    public getCurrentHtmlEditor(): IHtmlEditor {
        return this.htmlEditor;
    }
}