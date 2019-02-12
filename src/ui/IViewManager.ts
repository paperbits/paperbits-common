import { IView, IComponent, IHighlightConfig, IContextCommandSet } from "./";
import { DragSession } from "./draggables";
import { SettingsContract } from "../sites";
import { PageContract } from "../pages";
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
    addProgressIndicator(title: string, content: string): void;

    addPromiseProgressIndicator<T>(promise: Promise<T>, title: string, content: string): void;

    journeyName(): string;

    foldEverything(): void;

    foldWorkshops(): void;

    unfoldWorkshop(): void;

    clearJourney(): void;

    closeWidgetEditor(): void;

    notifySuccess(title: string, content: string): void;

    scheduleIndicatorRemoval(indicator: any): void;

    updateJourneyComponent(component: IView);

    unfoldEverything(): void;

    openViewAsWorkshop(heading: string, componentName: string, parameters?: any): IView;

    closeWorkshop(editor: IView | string);

    openUploadDialog(): Promise<File[]>;

    openViewAsPopup(view: IView);

    openWidgetEditor(binding: IWidgetBinding): void;

    getOpenView(): IView;

    setContextualEditor(editorName: string, contextualEditor: IContextCommandSet): void;

    removeContextualEditor(editorName: string): void;

    clearContextualEditors(): void;

    setHighlight(config: IHighlightConfig): void;

    setSelectedElement(config: IHighlightConfig, ce: IContextCommandSet): void;

    getSelectedElement(): IHighlightConfig;

    itemSelectorName(name: string): string;

    mode: ViewManagerMode;

    setViewport(viewport: string): void;

    getViewport(): string;

    setShutter(): void;

    removeShutter(): void;

    beginDrag(session: DragSession): void;

    getDragSession(): DragSession;

    loadFavIcon(): Promise<void>;

    addBalloon(component: IComponent): void;

    removeBalloon(component: IComponent): void;

    setSplitter(config: ISplitterConfig): void;

    setHost(component: IComponent);

    getHostDocument(): Document;
}