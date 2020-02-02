import { Bag } from "@paperbits/common";
import { StyleSheet } from "@paperbits/common/styles";
import { EventManager } from "@paperbits/common/events";


export class StyleManager {
    private styleSheets: Bag<StyleSheet>;

    constructor(private readonly eventManager: EventManager = null) {
        this.styleSheets = {};
    }

    public setStyleSheet(styleSheet: StyleSheet): void {
        this.styleSheets[styleSheet.key] = styleSheet;

        if (this.eventManager) {
            this.eventManager.dispatchEvent("onStyleChange", styleSheet);
        }
    }

    public getStyleSheet(key: string): StyleSheet {
        return this.styleSheets[key];
    }

    public getAllStyleSheets(): StyleSheet[] {
        return Object.values(this.styleSheets);
    }

    public removeStyleSheet(key: string): void {
        if (this.eventManager) {
            this.eventManager.dispatchEvent("onStyleRemove", key);
        }
    }

    public removeAllStyleSheets(): void {
        this.styleSheets = {};
    }
}