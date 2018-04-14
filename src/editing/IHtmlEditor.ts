import { IHyperlink } from "../permalinks/IHyperlink";
import { IBag } from '../IBag';
import { Intention } from "../appearance/intention";
import { SelectionState } from "./selectionState";

export var formattableStates = ["bold", "italic", "underlined", "hyperlink", "h1", "h2", "h3", "h4", "h5", "h6",
    "quote", "code", "ol", "ul", "alignedLeft", "alignedRight", "alignedCenter", "justified"];



export interface ISelectionPosition {
    anchorKey: string;
    anchorOffset: number;
    focusKey: string;
    focusOffset: number;
}

export interface IHtmlEditor {
    attachToElement(element: HTMLElement): void;
    enable(): void;
    disable(): void;
    getSelectionState(): SelectionState;
    toggleBold(): void;
    toggleItalic(): void;
    toggleUnderlined(): void;
    toggleH1(): void;
    toggleH2(): void;
    toggleH3(): void;
    toggleH4(): void;
    toggleH5(): void;
    toggleH6(): void;
    toggleQuote(): void;
    toggleCode(): void;
    toggleIntention(intention: Intention): void;
    setIntention(intention: Intention): void;
    resetToNormal(): void;
    setHyperlink(data: IHyperlink, selectionPosition?: ISelectionPosition): any;
    removeHyperlink(): void;
    getHyperlink(): IHyperlink;
    setSelection(selection: Selection): void;
    expandSelection(): void;
    getState(): Object;
    setState(state: Object): void;
    getSelectionText(): string;
    setList(intention: Intention);
    increaseIndent(): void;
    decreaseIndent(): void;

    /* Events */
    addSelectionChangeListener(callback: () => void): void;
    removeSelectionChangeListener(callback: () => void): void;
}