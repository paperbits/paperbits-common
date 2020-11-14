import { View, IComponent, IHighlightConfig, IContextCommandSet, ICommand, Toast } from ".";
import { DragSession } from "./draggables";
import { IWidgetBinding } from "../editing";
import { RoleModel } from "../user";


export enum ViewManagerMode {
    selecting = "selectig",
    dragging = "dragging",
    selected = "selected",
    configure = "configure",
    pause = "pause",
    preview = "preview"
}

export interface ISplitterConfig {
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
    addToast(title: string, content: string, commands?: ICommand[]): Toast;
    removeToast(toast: Toast): void;
    journeyName(): string;
    hideToolboxes(): void;
    showToolboxes(): void;
    clearJourney(): void;
    closeView(): void;
    notifyInfo(title: string, content: string, commands?: ICommand[]): void;
    notifySuccess(title: string, content: string): void;
    notifyError(title: string, content: string): void;
    notifyProgress<T>(promise: Promise<T>, title: string, content: string): void;
    openViewAsPopup(view: View): void;
    openViewAsWorkshop(view: View): void;
    getOpenView(): View;
    closeWorkshop(editor: View | string): void;

    /**
     * Opens upload file dialog.
     * @param accept File extensions, e.g. ".ttf,.woff";
     */
    openUploadDialog(...accept: string[]): Promise<File[]>;
    openWidgetEditor(binding: IWidgetBinding<any>): void;
    setContextualEditor(editorName: string, contextualEditor: IContextCommandSet): void;
    removeContextualEditor(editorName: string): void;
    clearContextualEditors(): void;
    setHighlight(config: IHighlightConfig): void;
    setSelectedElement(config: IHighlightConfig, ce: IContextCommandSet): void;
    getSelectedElement(): IHighlightConfig;
    mode: ViewManagerMode;
    setViewport(viewport: string): void;
    getViewport(): string;
    setViewRoles(roles: RoleModel[]): void;
    getViewRoles(): RoleModel[];
    setShutter(): void;
    removeShutter(): void;
    beginDrag(session: DragSession): void;
    getDragSession(): DragSession;
    setSplitter(config: ISplitterConfig): void;
    setHost(component: IComponent): void;
    getHost(): IComponent;
    getHostDocument(): Document;
}