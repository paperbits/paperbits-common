import { IComponent } from "./IComponent";

export interface IContextCommandSet {
    color?: string;
    element?: HTMLElement;
    hoverCommand?: IContextCommand;
    selectCommands?: IContextCommand[];
    deleteCommand?: IContextCommand;
}

export interface IContextCommand {
    callback?: () => void;
    component?: IComponent;
    tooltip?: string;
    position?: string;
    iconClass?: string;
    color?: string;
}
