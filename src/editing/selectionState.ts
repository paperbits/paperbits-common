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
    public intentions: any;
    public anchorKey: string;

    /**
     * Alignment of a block in current viewport.
     */
    public alignment: string;

    /**
     * Font family.
     */
    public font: string;
}