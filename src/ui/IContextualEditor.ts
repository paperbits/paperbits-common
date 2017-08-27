import { IComponent } from "./IComponent";

export interface IContextualEditor {
    color?: string;
    element?: HTMLElement;
    hoverCommand?: IContextualEditorCommand;
    selectionCommands?: IContextualEditorCommand[];
    deleteCommand?: IContextualEditorCommand;
}

export interface IContextualEditorCommand {
    callback?: () => void;
    component?: IComponent;
    tooltip?: string;
    position?: string;
    iconClass?: string;
    color?: string;
}
