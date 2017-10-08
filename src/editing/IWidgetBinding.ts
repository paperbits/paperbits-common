import { DragSession } from "../ui/draggables/dragManager";

export interface IWidgetBinding {
    name: string;
    params: Object;
    oncreate?: (viewModel: any) => void;
    setupViewModel?: (viewModel: any) => void;
    nodeType: string;
    model?: Object;
    editor?: string;
    hideCloseButton?: boolean;
    applyChanges?: () => void;
    children?: Array<IWidgetBinding>;
    readonly?: boolean;
    canAcceptDraggedItem?: (draggedItem: DragSession) => string;
}