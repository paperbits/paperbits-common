import { RowModel } from "./rowModel";
import { IModel } from "./IModel";
import { BackgroundModel } from "./backgroundModel";

export class SectionModel implements IModel {
    public type: string = "section";
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