import { RowModel } from "./rowModel";
import { IModel } from "./IModel";

export class SectionModel implements IModel {
    public type: string = "section";
    public rows: RowModel[];
    public layout: string;
    public padding: string;
    public snap: string;
    public height: string;
    public backgroundType: string;
    public backgroundIntentionKey: string;
    public backgroundSourceKey: string;
    public backgroundPictureUrl: string;
    public backgroundSize: string;
    public backgroundPosition: string;
    public backgroundRepeat: string;

    constructor() {
        this.layout = "container";
        this.padding = "with-padding";
        this.snap = "none";
        this.backgroundType = "none";
        this.backgroundSize = "cover";
        this.backgroundPosition = "center center";
        this.backgroundRepeat = "no-repeat";
        this.rows = [];
    }
}