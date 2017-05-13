import { NavbarItemModel } from "./navbarItemModel";
import { IModel } from "./IModel";

export class NavbarModel implements IModel {    
    public type: string = "navbar";
    public rootKey: string; // Should it move to NavbarItemModel?
    public root: NavbarItemModel;
    public align?: string;
    public isActive:boolean;
}