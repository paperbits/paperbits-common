import { IHighlightConfig } from "./IHighlightConfig";
import { IContextualEditor } from "./IContextualEditor";
import { IView } from "./IView";
import { ProgressPromise } from '../progressPromise';
import { DragSession } from "./draggables/dragSession";
import { ISettings } from "../sites/ISettings";
import { PageContract } from "../pages/pageContract";

export enum ViewManagerMode {
    selecting,
    dragging,
    selected,
    configure,
    zoomout
}

export interface IViewManager {
    addProgressIndicator(title: string, content: string);

    addPromiseProgressIndicator<T>(task: Promise<T>, title: string, content: string);

    openViewAsWorkshop(heading: string, componentName: string, parameters?: any): void;

    journeyName(): string;

    foldEverything(): void;

    foldWorkshops(): void;

    unfoldWorkshop(): void;

    clearJourney(): void;

    closeWidgetEditor(): void;

    notifySuccess(title: string, content: string): void;

    addProgressIndicator(title: string, content: string, progress?: number);

    addPromiseProgressIndicator<T>(task: ProgressPromise<T>, title: string, content: string);

    scheduleIndicatorRemoval(indicator: any): void;

    updateJourneyComponent(component: IView);

    clearJourney(): void;

    foldWorkshops(): void;

    unfoldWorkshop(): void;

    foldEverything(): void;

    unfoldEverything(): void;

    openViewAsWorkshop(componentName: string, parameters?: any): IView;

    closeWorkshop(editor: IView | string);

    openUploadDialog(): Promise<Array<File>>;

    openViewAsPopup(view: IView);

    getWidgetview(): IView;

    setContextualEditor(editorName: string, contextualEditor: IContextualEditor);

    removeContextualEditor(editorName: string): void;

    clearContextualEditors(): void;

    setHighlight(config: IHighlightConfig): void;

    setSelectedElement(config: IHighlightConfig, ce: IContextualEditor): void;

    getSelectedElement(): IHighlightConfig;

    closeWidgetEditor();

    itemSelectorName(name: string): string;

    mode: ViewManagerMode;

    setViewport(viewport: string);

    getViewport(): string;

    switchToEditing(): void;

    setShutter(): void;

    removeShutter(): void;

    beginDrag(session: DragSession): void;

    getDragSession(): DragSession;

    loadFavIcon(): Promise<void>;

    setTitle?(settings?:ISettings, page?: PageContract): Promise<void>;
}