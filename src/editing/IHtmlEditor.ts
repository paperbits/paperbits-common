import { IHyperlink } from "../permalinks/IHyperlink";
import { IBag } from '../core/IBag';

export var formattableStates = ["bold", "italic", "underlined", "hyperlink", "h1", "h2", "h3", "h4", "h5", "h6",
    "quote", "code", "ol", "ul", "alignedLeft", "alignedRight", "alignedCenter", "justified"];

export class SelectionState {
    public normal: boolean;
    public bold: boolean;
    public italic: boolean;
    public underlined: boolean;
    public hyperlink: boolean;
    public h1: boolean;
    public h2: boolean;
    public h3: boolean;
    public h4: boolean;
    public h5: boolean;
    public h6: boolean;
    public quote: boolean;
    public code: boolean;
    public ol: boolean;
    public ul: boolean;
    public intentions: IBag<string[]>;
}

export interface ISelectionPosition {
    anchorKey: string;
    anchorOffset: number;
    focusKey: string;
    focusOffset: number;
}

export interface IHtmlEditor {
    getSelectionState(): SelectionState;
    toggleBold(): void;
    toggleItalic(): void;
    toggleUnderlined(): void;
    toggleUl(): void;
    toggleOl(): void;
    toggleH1(): void;
    toggleH2(): void;
    toggleH3(): void;
    toggleH4(): void;
    toggleH5(): void;
    toggleH6(): void;
    toggleQuote(): void;
    toggleCode(): void;

    /**
     * Toggles alignment category.
     */
    toggleAlignment(intentionFn: string | string[]): void;

    /**
     * Toggles color category.
     */
    toggleColor(intentionFn: string | string[]): void;

    /**
     * Toggles specific category, i.e. "color" or "alignment".
     * 
     * @param {string} category Name of category.
     * @param {string} intentionFn Intention function name or list of function names.
     * @param {string} type Can be either "block" or "inline".
     */
    toggleCategory(category: string, intentionFn: string | string[], type: string): void;
    toggleIntention(category: string, intentionFn: string | string[], type: string): void;
    resetToNormal(): void;
    setHyperlink(data: IHyperlink, selectionPosition?: ISelectionPosition): any;
    removeHyperlink(): void;
    getHyperlink(): IHyperlink;
    enable(): void;
    disable(): void;
    addSelectionChangeListener(callback: () => void): void;
    removeSelectionChangeListener(callback: () => void): void;
    renderToContainer(element: HTMLElement): IHtmlEditor;
    setSelection(selection: Selection): void;
    expandSelection(): void;
    getState(): Object;
    setState(state: Object): void;
    getSelectionText(): string;
}

export class HtmlEditorEvents {
    static onSelectionChange = "onSelectionChange";
    static onEditorDisabled = "onEditorDisabled";
}

