import { StyleSheet, StyleManager } from "./";

/**
 * Style definition.
 */
export interface StyleModel {
    key: string;
    classNames: string;
    css?: string;
    styleSheet: StyleSheet;
    styleManager?: StyleManager;
}
