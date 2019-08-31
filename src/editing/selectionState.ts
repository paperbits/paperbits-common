import { Breakpoints } from "../";

export class SelectionState {
    public block: string;
    public bold: boolean;
    public italic: boolean;
    public underlined: boolean;
    public highlighted: boolean;
    public code: boolean;
    public hyperlink: boolean;
    public colorKey: string;
    public anchorKey: string;
    public orderedList: boolean;
    public bulletedList: boolean;

    /**
     * Alignment of a block in current viewport.
     */
    public alignment: Breakpoints<string>;

    /**
     * Text style of a block in current viewport.
     */
    // public appearance: Breakpoints;
    public appearance: string;

    constructor() {
        this.block = "paragraph";
    }
}

export const alignmentStyleKeys = {
    left: "utils/text/alignLeft",
    center: "utils/text/alignCenter",
    right: "utils/text/alignRight",
    justify: "utils/text/justify"
};