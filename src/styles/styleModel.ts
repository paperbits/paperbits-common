import { StyleSheet, StyleManager } from "./";

/**
 * Style definition.
 */
export class StyleModel {
    /**
     * CSS class names.
     */
    public classNames: string;

    /**
     * Parent stylesheet where the widget styles reside.
     */
    public styleSheet: StyleSheet;

    /**
     * @deprecated.
     */
    public styleManager?: StyleManager;

    public toString(): string {
        return this.classNames;
    }
}
