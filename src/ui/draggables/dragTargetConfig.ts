import { Quadrant } from "../quadrant";

export interface DragTargetConfig {
    targetData: any;

    accept: (sourceData: any, dragged: HTMLElement) => boolean;
    ondrop: (sourceData: any, targetData?: any, quadrant?: Quadrant) => void;
    ondropbefore: (sourceData: any, dragged: HTMLElement) => void;
    ondropafter: (sourceData: any, dragged: HTMLElement) => void;
    onacceptbefore: (dragged: HTMLElement, acceptor: HTMLElement, sourceData?: any) => void;
    onacceptafter: (dragged: HTMLElement, acceptor: HTMLElement, sourceData?: any) => void;
    flow: string;
    placeholder?: string;
}