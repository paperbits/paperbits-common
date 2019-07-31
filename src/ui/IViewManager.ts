import { IView, IComponent, IHighlightConfig, IContextCommandSet, ICommand, Toast } from "./";
import { DragSession } from "./draggables";
import { IWidgetBinding } from "../editing";


export enum ViewManagerMode {
    selecting,
    dragging,
    selected,
    configure,
    pause
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

export interface IViewManager {
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
    updateJourneyComponent(component: IView): void;
    openViewAsPopup(view: IView): void;
    openViewAsWorkshop(view: IView): void;
    getOpenView(): IView;
    closeWorkshop(editor: IView | string): void;
    openUploadDialog(): Promise<File[]>;
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
    setShutter(): void;
    removeShutter(): void;
    beginDrag(session: DragSession): void;
    getDragSession(): DragSession;
    addBalloon(component: IComponent): void;
    removeBalloon(component: IComponent): void;
    setSplitter(config: ISplitterConfig): void;
    setHost(component: IComponent): void;
    getHost(): IComponent;
    getHostDocument(): Document;
}