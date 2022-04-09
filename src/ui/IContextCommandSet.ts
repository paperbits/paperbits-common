import { IComponent } from "./IComponent";

export interface IContextCommandSet {
    color?: string;
    element?: HTMLElement;
    displayName?: string;
    hoverCommands?: IContextCommand[];
    selectCommands?: IContextCommand[];
    deleteCommand?: IContextCommand;
    defaultCommand?: IContextCommand;
}

export interface IContextCommand {
    name?: string;
    displayName?: string;
    callback?: () => void;
    component?: IComponent;
    tooltip?: string;
    position?: string;
    iconClass?: string;
    color?: string;
    controlType: string;

    /**
     * Temporary hack for keeping selected element.
     */
    doNotClearSelection?: boolean;
}
