export interface ToolButton {
    iconClass: string;
    title: string;
    tooltip?: string | (() => string);
    onActivate: () => void;
}