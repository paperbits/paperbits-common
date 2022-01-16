import * as ko from "knockout";

/**
 * Attaches the designer application to specified DOM element.
 * @param element HTML element the designer app to be attached to.
 */
export function attachDesignerTo(element: HTMLElement): void {
    ko.applyBindingsToNode(element, { component: "view-manager" }, null);
}