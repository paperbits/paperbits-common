import { StyleSheet, StyleManager } from "./";

/**
 * Style definition.
 */
export interface StyleModel {
    key: string;
    classNames: string;
    styleSheet: StyleSheet;
    styleManager?: StyleManager;
}
