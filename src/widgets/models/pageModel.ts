import { SectionModel } from "./sectionModel";
import { IModel } from "./IModel";

export class PageModel implements IModel {   
    public type: string = "page";
    public title: string;
    public description: string;
    public keywords: string;
    public sections: SectionModel[];

    constructor() {
        this.sections = [];
    }
}
