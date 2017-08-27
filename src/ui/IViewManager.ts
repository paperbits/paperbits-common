import { IHighlightConfig } from "./IHighlightConfig";
import { IContextualEditor } from "./IContextualEditor";
import { IEditorSession } from "./IEditorSession";
import { ProgressPromise } from '../core/progressPromise';
import { IComponent } from '../ui/IComponent';

export enum ViewManagerMode {
    edit,
    fold,
    select,
    configure
}

export interface IViewManager {
    getCurrentJourney(): string;

    addProgressIndicator(title: string, content: string);

    addPromiseProgressIndicator<T>(task: ProgressPromise<T>, title: string, content: string);

    openWorkshop(componentName: string, parameters?: any): void;

    foldEverything(): void;

    foldWorkshops(): void;

    unfoldWorkshop(): void;

    clearJourney(): void;

    closeWidgetEditor(): void;

    notifySuccess(title: string, content: string): void;

    addProgressIndicator(title: string, content: string, progress?: number);

    addPromiseProgressIndicator<T>(task: ProgressPromise<T>, title: string, content: string);

    scheduleIndicatorRemoval(indicator: any): void;

    newJourney(journeyName: string, componentName: string, parameters?: any);

    updateJourneyComponent(component: IComponent);

    clearJourney(): void;

    foldWorkshops(): void;

    unfoldWorkshop(): void;

    foldEverything(): void;

    unfoldEverything(): void;

    openWorkshop(componentName: string, parameters?: any): void;

    closeWorkshop(componentName: string);

    openUploadDialog(): Promise<Array<File>>;

    setWidgetEditor(editorSession: IEditorSession);

    getWidgetEditorSession(): IEditorSession;

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
}