import { NavbarItemModel } from "./navbarItemModel";


export class NavbarModel {
    public rootKey: string; // Should it move to NavbarItemModel?
    public root: NavbarItemModel;
    public isActive: boolean;
    public pictureSourceKey: string;
    public pictureSourceUrl: string;
}