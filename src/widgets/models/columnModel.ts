import { IModel } from "./IModel";

export class ColumnModel implements IModel {    
    public type: string = "column";
    public widgets: IModel[];
    public sizeSm: number;
    public sizeMd: number;
    public sizeLg: number;
    public alignmentSm: string;
    public alignmentMd: string;
    public alignmentLg: string;

    constructor() {
        this.widgets = [];
    }
}