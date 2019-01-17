import { HyperlinkModel } from "./../permalinks";
import { SelectionState } from "./selectionState";

export let formattableStates = ["bold", "italic", "underlined", "highlighted", "hyperlink", "h1", "h2", "h3", "h4", "h5", "h6",
    "quote", "code", "ol", "ul", "alignedLeft", "alignedRight", "alignedCenter", "justified"];

export interface ISelectionPosition {
    anchorKey: string;
    anchorOffset: number;
    focusKey: string;
    focusOffset: number;
}

export interface IHtmlEditor {
    attachToElement(element: HTMLElement): void;
    detachFromElement(): void;
    getSelectionState(): SelectionState;
    toggleBold(): void;
    toggleItalic(): void;
    toggleUnderlined(): void;
    toggleHighlighted(): void;
    toggleParagraph(): void;
    toggleH1(): void;
    toggleH2(): void;
    toggleH3(): void;
    toggleH4(): void;
    toggleH5(): void;
    toggleH6(): void;
    toggleQuote(): void;
    toggleFormatted(): void;
    toggleSize(): void;
    toggleOrderedList(): void;
    toggleUnorderedList(): void;
    alignLeft(viewport?: string): void;
    alignCenter(viewport?: string): void;
    alignRight(viewport?: string): void;
    justify(viewport?: string): void;
    setTypegraphy(font: string): void;
    setHyperlink(hyperlink: HyperlinkModel, selectionPosition?: ISelectionPosition): void;
    setAnchor(hash: string, anchorKey: string): void;
    removeAnchor(): void;
    removeHyperlink(): void;
    setColor(colorKey: string): void;
    removeColor(): void;
    getHyperlink(): HyperlinkModel;
    expandSelection(): void;
    getState(): Object;
    setState(state: Object): void;
    getSelectionText(): string;
    increaseIndent(): void;
    decreaseIndent(): void;

    /* Events */
    addSelectionChangeListener(callback: () => void): void;
    removeSelectionChangeListener(callback: () => void): void;
}