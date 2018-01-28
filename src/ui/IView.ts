import { IComponent } from "./IComponent";

export interface IView {
    heading?: string;
    
    component: IComponent;

    /**
     * Allowed values: "vertically", "horizontally".
     */
    resize?: string;
}