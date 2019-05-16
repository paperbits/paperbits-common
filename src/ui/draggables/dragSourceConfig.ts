export interface DragSourceConfig {
    payload: any;

    /**
     * Tells dragged element to go either to new place or get back to origin.
     */
    sticky: boolean;
    ondragstart?: (payload: any, dragged: HTMLElement) => HTMLElement;
    ondragend?: (payload: any, dragged: HTMLElement) => void;
    preventDragging?: (candidate: HTMLElement) => boolean;
    inertia?: boolean;
}