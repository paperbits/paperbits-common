export interface ToolButton {
    iconClass: string;
    title: string;
    helpText?: string;
    onActivate: () => void;
}