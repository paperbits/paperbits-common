import { ISelectionBox } from '../editing/ISelectionBox';
import { IHyperlink } from "../permalinks/IHyperlink";

export var formattableStates = ["bold", "italic", "underlined", "hyperlink", "h1", "h2", "h3", "h4", "h5", "h6",
    "quote", "code", "ol", "ul", "alignedLeft", "alignedRight", "alignedCenter", "justified"];

export class ParagraphAlignmentClassNames {
    static alignLeft = "text-left";
    static alignCenter = "text-center";
    static alignRight = "text-right";
    static justify = "text-justify";
}

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
    public intentions: Intentions;
}

export interface Intentions {
    block: string[];
    inline: string[];
}

export interface ISelectionPosition {
    anchorKey: string;
    anchorOffset: number;
    focusKey: string;
    focusOffset: number;
}

export interface ISelectionBox {
    top: number;
    left: number;
    width: number;
    height: number;
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
    toggleAlignment(intentionFn: string): void;
    toggleColor(intentionFn: string): void;
    toggleCategory(category: string, intentionFn: string, type: string): void;
    setIntention(intentionFn: string, type: string): void;
    resetIntention(intentionFn: string, type: string): void;
    resetToNormal(): void;
    setHyperlink(data: IHyperlink, selectionPosition?: ISelectionPosition);
    removeHyperlink(): void;
    getHyperlink(): IHyperlink;
    enable(): void;
    disable(): void;
    addSelectionChangeListener(callback: () => void): void;
    removeSelectionChangeListener(callback: () => void): void;
    addDisabledListener(callback: () => void): void;
    removeDisabledListener(callback: () => void): void;
    addEnabledListener(callback: () => void): void;
    removeEnabledListener(callback: () => void): void;
    renderToContainer(element: HTMLElement): IHtmlEditor;
    getState(): any;
    updateState(state: any): void;
    setInitialState(state: any): void;
    setSelection(selection: Selection): void;
    expandSelection(): void;
}

export class HtmlEditorEvents {
    static onSelectionChange = "onSelectionChange";
    static onEditorDisabled = "onEditorDisabled";
}
