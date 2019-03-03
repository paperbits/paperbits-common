export interface ICommand {
    title: string;
    iconClass?: string;
    action: () => Promise<void>;
}