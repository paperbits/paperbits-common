import { IComponent } from "./IComponent";

export interface IEditorSession {
    component: IComponent;

    /**
     * Allowed values: "vertically", "horizontally" and "both".
     */
    resize?: string;
}