import { IComponent } from "./IComponent";

export interface IEditorSession {
    heading?: string;
    
    component: IComponent;

    /**
     * Allowed values: "vertically", "horizontally" and "all".
     */
    resize?: string;
}