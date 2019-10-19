import { IComponent } from "./IComponent";

export interface View {
    /**
     * View heading, e.g. "Picture editor".
     */
    heading?: string;

    /**
     * Definition of a UI component behind this view.
     */
    component: IComponent;

    /**
     * Allowed values: "vertically", "horizontally".
     */
    resize?: string;

    /**
     * Help text.
     */
    helpText?: string;
}