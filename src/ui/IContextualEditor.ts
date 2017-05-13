import { IComponent } from "./IComponent";

export interface IContextualEditor {
    element?: HTMLElement;
    component: IComponent;
    position: string;
    deleteCallback?: () => void;
    deleteTooltip?: string;
    settingsCallback?: () => void;
    settingsTooltip?: string;
    color?: string;
    addTooltip?: string;
}