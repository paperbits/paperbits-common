export interface ToolButton {
    iconClass: string;
    title: string;
    helpText?: string;
    hostName?: string;
    onActivate: () => void;
}