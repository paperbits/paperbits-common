import { Bag } from "..";
import { StyleSheet } from "../styles";
import { EventManager, Events } from "../events";


export class StyleManager {
    private styleSheets: Bag<StyleSheet>;

    constructor(private readonly eventManager: EventManager = null) {
        this.styleSheets = {};
    }

    public setStyleSheet(styleSheet: StyleSheet): void {
        this.styleSheets[styleSheet.key] = styleSheet;

        if (this.eventManager) {
            this.eventManager.dispatchEvent(Events.StyleChange, styleSheet);
        }
    }

    public getStyleSheet(key: string): StyleSheet {
        return this.styleSheets[key];
    }

    public getAllStyleSheets(): StyleSheet[] {
        return Object.values(this.styleSheets);
    }

    public removeStyleSheet(styleSheet: StyleSheet): void {
        if (this.eventManager) {
            this.eventManager.dispatchEvent(Events.StyleRemove, styleSheet.key);
        }
    }

    public removeAllStyleSheets(): void {
        this.styleSheets = {};
    }
}