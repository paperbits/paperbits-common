import { IWidgetBinding } from ".";

export interface GridItem {
    element: HTMLElement;
    binding: IWidgetBinding<any, any>;
    getSiblings?(): GridItem[];
    getParent?(): GridItem;
    getChildren?(): GridItem[];
    getNextSibling?: () => GridItem;
    getPrevSibling?: () => GridItem;
}
