import { RowModel } from "../row/rowModel";
import { BackgroundModel } from "../background/backgroundModel";


export class SectionModel {
    public rows: RowModel[];
    public layout: string;
    public padding: string;
    public snap: string;
    public height: string;
    public background: BackgroundModel;

    constructor() {
        this.layout = "container";
        this.padding = "with-padding";
        this.snap = "none";
        this.background = new BackgroundModel();
        this.rows = [];
    }
}