import { IModel } from "./IModel";

export class LayoutModel implements IModel {
    public type: string = "layout";
    public title: string;
    public description: string;   
    public uriTemplate: string;
    public sections: IModel[]; // can be only page or section

    constructor() {
        this.sections = [];
    }
}
