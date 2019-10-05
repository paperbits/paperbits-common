export interface DragSourceConfig {
    sourceData: any;

    /**
     * Tells dragged element to go either to new place or get back to origin.
     */
    sticky: boolean;
    ondragstart?: (sourceData: any, dragged: HTMLElement) => HTMLElement;
    ondragend?: (sourceData: any, dragged: HTMLElement) => void;
    preventDragging?: (candidate: HTMLElement) => boolean;
    inertia?: boolean;
}