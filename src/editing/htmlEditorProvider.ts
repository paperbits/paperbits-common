import { IHtmlEditor, formattableStates } from '../editing/IHtmlEditor';
import { IEventManager } from '../events/IEventManager';

export interface IHtmlEditorProvider {
    getCurrentHtmlEditor(): IHtmlEditor;
}

/**
 * This is Slate specific component and needs to be move into slate package.
 */
export class HtmlEditorProvider implements IHtmlEditorProvider {
    private htmlEditor: IHtmlEditor;

    constructor(eventManager: IEventManager) {
        this.getCurrentHtmlEditor = this.getCurrentHtmlEditor.bind(this);
        this.setCurrentHtmlEditor = this.setCurrentHtmlEditor.bind(this);

        eventManager.addEventListener("htmlEditorChanged", this.setCurrentHtmlEditor);
        eventManager.addEventListener("enableHtmlEditor", this.setCurrentHtmlEditor);
    }

    private setCurrentHtmlEditor(htmlEditor: IHtmlEditor): void {
        this.htmlEditor = htmlEditor;
    }

    public getCurrentHtmlEditor(): IHtmlEditor {
        return this.htmlEditor;
    }
}
