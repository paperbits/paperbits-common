export interface IDragSourceConfig {
    payload: any;
    sticky: boolean;
    ondragstart?: (payload: any, dragged: HTMLElement) => HTMLElement;
    ondragend?: (payload: any, dragged: HTMLElement) => void;
    preventDragging?: (candidate: HTMLElement) => boolean;
}