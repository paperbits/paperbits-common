import { View, IComponent, IHighlightConfig, IContextCommandSet, ICommand, Toast } from ".";
import { DragSession } from "./draggables";
import { IWidgetBinding } from "../editing";
import { RoleModel } from "../user";


export enum ViewManagerMode {
    selecting = "selecting",
    dragging = "dragging",
    selected = "selected",
    configure = "configure",
    pause = "pause",
    preview = "preview"
}

export interface ISplitterConfig {
    /**
     * Element relative to which the splitter gets placed.
     */
    element: HTMLElement;

    /**
     * Possible values: "top", "bottom", "left", "right";
     */
    side: string;

    /**
     * Possible values: "inside", "outside";
     */
    where: string;
}

export interface ViewManager {
    /**
     * Adds toast message to the stack.
     * @param title {string} Message title.
     * @param content {string} Message content.
     * @param commands {ICommand[]} Message commands.
     */
    addToast(title: string, content: string, commands?: ICommand[]): Toast;

    /**
     * Removed the toast message from the stack.
     * @param toast {Toast} Toast message.
     */
    removeToast(toast: Toast): void;

    /**
     * Returns active journey name.
     */
    journeyName(): string;

    /**
     * Hides all active toolboxes.
     */
    hideToolboxes(): void;

    /**
     * Reveals all hidden toolboxes.
     */
    showToolboxes(): void;

    /**
     * Clears active journey.
     */
    clearJourney(): void;

    /**
     * Close active view.
     */
    closeView(): void;

    /**
     * Shows informational toast message.
     * @param title {string} Message title.
     * @param content {string} Message content.
     * @param commands {ICommand[]} Message commands.
     */
    notifyInfo(title: string, content: string, commands?: ICommand[]): Toast;

    /**
     * Shows success toast message.
     * @param title {string} Message title.
     * @param content {string} Message content.
     * @param commands {ICommand[]} Message commands.
     */
    notifySuccess(title: string, content: string): Toast;

    /**
     * Shows error toast message.
     * @param title {string} Message title.
     * @param content {string} Message content.
     * @param commands {ICommand[]} Message commands.
     */
    notifyError(title: string, content: string): Toast;

    /**
     * Shows progress toast message.
     * @param title {string} Message title.
     * @param content {string} Message content.
     * @param commands {ICommand[]} Message commands.
     */
    notifyProgress<T>(promise: Promise<T>, title: string, content: string): Toast;

    /**
     * Opens specified view in a popup window.
     * @param view {View} A view.
     */
    openViewAsPopup(view: View): void;

    /**
     * Opens specified view in the workshop stack.
     * @param view {View} A view.
     */
    openViewAsWorkshop(view: View): void;

    /**
     * Returns active view (or null, if none open).
     */
    getActiveView(): View;

    /**
     * Deletes specified view and all views after it in the stack.
     * @param view {View|string} View object or view component name.
     */
    closeWorkshop(view: View | string): void;

    /**
     * Opens upload file dialog.
     * @param accept File extensions, e.g. ".ttf,.woff";
     */
    openUploadDialog(...accept: string[]): Promise<File[]>;

    /**
     * Opens editor view for widget associated with the binding.
     * @param binding {IWidgetBinding<any, any>} Widget binding.
     */
    openWidgetEditor(binding: IWidgetBinding<any, any>): void;

    /**
     * Shows contextual editor for specfied widget.
     * @param widgetName {string} Name of a widget.
     * @param commands {IContextCommandSet} Set of commands.
     */
    setContextualCommands(widgetName: string, commands: IContextCommandSet): void;

    /**
     * Removes contextual editor for specfied widget.
     * @param widgetName {string} Name of a widget.
     */
    removeContextualCommands(widgetName: string): void;

    /**
     * Clears all contextual editors.
     */
    clearContextualCommands(): void;

    /**
     * Highlights the element specfied in the configuration.
     * @param config 
     */
    setHighlight(config: IHighlightConfig): void;

    /**
     * Selects element specfied in the configuration and shows associated commands.
     * @param config 
     * @param commands 
     */
    setSelectedElement(config: IHighlightConfig, commands: IContextCommandSet): void;

    /**
     * Returns user-selected element.
     */
    getSelectedElement(): IHighlightConfig;

    /**
     * Reflects current view managed mode.
     */
    mode: ViewManagerMode;

    /**
     * Switches viewport.
     * @param viewport {string} Viewport identifier, e.g. `xs`, `sm`, `md`, `lg`, `xl`.
     */
    setViewport(viewport: string): void;

    /**
     * Gets current viewport.
     * @returns A viewport identifier, e.g. `xs`, `sm`, `md`, `lg`, `xl`.
     */
    getViewport(): string;

    /**
     * Sets specified roles for the view to show/hide role-dependent elements.
     * @param roles {RoleModel[]} Roles.
     */
    setViewRoles(roles: RoleModel[]): void;

    /**
     * Return roles currently set for the view.
     */
    getViewRoles(): RoleModel[];

    /**
     * Shows the shutter. Used to show long running process, e.g. page loading.
     */
    setShutter(): void;

    /**
     * Removes the shutter.
     */
    removeShutter(): void;

    /**
     * Starts widget dragging.
     * @param session 
     */
    beginDrag(session: DragSession): void;

    /**
     * Returns information about the element being dragged.
     */
    getDragSession(): DragSession;

    /**
     * Shows splitter. Used to display where a dragged widget can be dropped.
     * @param config {ISplitterConfig} Splitter configuration.
     */
    setSplitter(config: ISplitterConfig): void;

    /**
     * Sets content host component.
     * @param component {IComponent} Component.
     */
    setHost(component: IComponent, canGoBack?: boolean): void;

    /**
     * Returns current content host component.
     */
    getHost(): IComponent;

    /**
     * Returns the document hosting the content component.
     */
    getHostDocument(): Document;

    /**
     * Returns the document hosting the designer.
     */
    getDesignerDocument(): Document;

    /**
     * Returns currently active layer name, e.g. `page` or `layout`.
     */
    getActiveLayer(): string;

    /**
     * Sets active layer.
     * @param layerName {string} Name of the layer.
     */
    setActiveLayer(layerName: string): void;

    /**
     * Temporarily disables contextual commands.
     */
    pauseContextualCommands(): void;

    /**
     * Resumes contextual commands.
     */
    resumeContextualCommands(): void;

    /**
     * Clears widget selection.
     */
    clearSelection(): void;
}