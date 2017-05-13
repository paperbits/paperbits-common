import { IModel } from "./IModel";

export class NavbarItemModel implements IModel {
    public type: string = "navbar-item";
    public label: string;
    public url: string;
    public nodes: NavbarItemModel[];
    public isActive: boolean;

    constructor() {
        this.nodes = [];
    }
}
