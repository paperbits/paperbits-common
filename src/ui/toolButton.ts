export interface ToolButton {
    iconClass: string;
    title: string;
    tooltip?: string;
    onActivate: () => void;
}