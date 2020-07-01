import { IComponent } from "./IComponent";

export interface IContextCommandSet {
    color?: string;
    element?: HTMLElement;
    hoverCommands?: IContextCommand[];
    selectCommands?: IContextCommand[];
    deleteCommand?: IContextCommand;
}

export interface IContextCommand {
    name?: string;
    callback?: () => void;
    component?: IComponent;
    tooltip?: string;
    position?: string;
    iconClass?: string;
    color?: string;
}
