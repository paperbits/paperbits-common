export interface IToolButton {
    iconClass: string;
    title: string;
    helpText?: string;
    onActivate: () => void;
}