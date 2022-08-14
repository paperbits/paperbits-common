import { IComponent } from "./IComponent";

/**
 * Tool button configuration.
 */
export interface ToolButton {
    /**
     * Icon CSS class, e.g. `widget-icon widget-icon-form`.
     */
    iconClass: string;

    /**
     * Title.
     */
    title: string;

    /**
     * Tooltip that appears on mouse hovering or getting focus.
     */
    tooltip?: string | (() => string);

    /**
     * Activation handler.
     */
    onActivate?: () => void;

    /**
     * A component shown in the balloon view.
     */
    component?: IComponent;
}