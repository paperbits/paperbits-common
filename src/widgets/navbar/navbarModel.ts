import { NavbarItemModel } from "./navbarItemModel";


export class NavbarModel {    
    public rootKey: string; // Should it move to NavbarItemModel?
    public root: NavbarItemModel;
    public align?: string;
    public isActive:boolean;
}