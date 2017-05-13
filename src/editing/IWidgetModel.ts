export interface IWidgetModel {
    name: string;
    params: Object;
    oncreate?: (viewModel: any) => void;
    setupViewModel?: (viewModel: any) => void;
    nodeType: string;
    model?: Object;
    editor?: string;
    hideCloseButton?: boolean;
    applyChanges?: () => void;
    children?: Array<IWidgetModel>;
    readonly?: boolean;
}