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
}