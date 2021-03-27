export interface ICommand {
    /**
     * Title shown in UI element representing the command.
     */
    title: string;

    /**
     * CSS class used to display the icon.
     */
    iconClass?: string;

    /**
     * Command action delegate.
     */
    action: () => Promise<void>;
}