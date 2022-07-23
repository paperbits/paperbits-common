import { StyleSheet, StyleManager } from "./";

/**
 * Style definition.
 */
export class StyleModel {
    classNames: string;
    
    styleSheet: StyleSheet;

    /**
     * @deprecated.
     */
    styleManager?: StyleManager;

    public toString(): string {
        return this.classNames;
    }
}
