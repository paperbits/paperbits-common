import { IWidgetBinding } from ".";
import { IContextCommandSet } from "../ui";

export interface GridItem {
    name?: string;
    displayName?: string;
    element: HTMLElement;
    binding?: IWidgetBinding<any, any>;
    getSiblings?(): GridItem[];
    getParent?(layerName?: string, excludeReadonly?: boolean): GridItem;
    getChildren?(layerName?: string, excludeReadonly?: boolean): GridItem[];
    getNextSibling?: () => GridItem;
    getPrevSibling?: () => GridItem;
    getContextCommands?: (half?: string) => IContextCommandSet;
    isStylable?: boolean;
    select(scrollIntoView?: boolean): void;
    editor: string | Function;
}
