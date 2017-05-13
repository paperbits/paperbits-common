export interface IDragTargetConfig {
    accept: (payload: any, dragged: HTMLElement) => boolean;
    ondrop: (payload: any) => void;
    ondropbefore: (payload: any, dragged: HTMLElement) => void;
    ondropafter: (payload: any, dragged: HTMLElement) => void;
    onacceptbefore: (dragged: HTMLElement, acceptor: HTMLElement, payload?: any) => void;
    onacceptafter: (dragged: HTMLElement, acceptor: HTMLElement, payload?: any) => void;
    flow: string;
    placeholder?: string;
}