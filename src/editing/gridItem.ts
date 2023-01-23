import { IWidgetBinding } from ".";
import { IContextCommandSet } from "../ui";

/**
 * Grid item is an abstraction that connects widget configuration with the visual editors.
 */
export interface GridItem {
    /**
     * Name, e.g. `button`. Usually same as widget binding name.
     */
    name?: string;

    /**
     * Display name, e.g. `Button`. Usually same as widget display name.
     */
    displayName?: string;

    /**
     * HTML element that represents the grid item.
     */
    element: HTMLElement;

    /**
     * Binding of the widget associated with this grid item.
     */
    binding: IWidgetBinding<any, any>;

    /**
     * Returns siblngs of this grid item.
     */
    getSiblings?(): GridItem[];

    /**
     * Returns parent grid item.
     * @param layerName - Name of the layer to filter out parent grid items.
     * @param excludeReadonly - Indicates if read-only parents need to be exluded.
     */
    getParent?(layerName?: string, excludeReadonly?: boolean): GridItem;

    /**
     * Returns child grid items.
     * @param layerName - Name of the layer to filter child grid items.
     * @param excludeReadonly - Indicates if read-only children need to be exluded.
     */
    getChildren?(layerName?: string, excludeReadonly?: boolean): GridItem[];

    /**
     * Returns next sibling grid item.
     */
    getNextSibling?: () => GridItem;

    /**
     * Returns previous sibling grid item.
     */
    getPrevSibling?: () => GridItem;

    /**
     * Returns context commands for this grid item.
     * @param half - Indicates which side of this widget the new widget shall land, e.g. `bottom`.
     */
    getContextCommands?: (half?: string) => IContextCommandSet;

    /**
     * Changes grid editor selection to this grid item.
     * @param scrollIntoView - Indicates if the grid item element should be scrolled into view.
     */
    select(scrollIntoView?: boolean): void;

    /**
     * An editor that should be invoked for this grid item.
     */
    editor: string | Function;
}
