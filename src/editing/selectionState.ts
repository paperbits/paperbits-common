export class SelectionState {
    public block: string;
    public bold: boolean;
    public italic: boolean;
    public underlined: boolean;
    public hyperlink: boolean;
    public anchorKey: string;
    public orderedList: boolean;
    public bulletedList: boolean;

    /**
     * Alignment of a block in current viewport.
     */
    public alignment: string;

    constructor() {
        this.block = "paragraph";
    }
}