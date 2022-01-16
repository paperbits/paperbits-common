import * as ko from "knockout";

export function attachDesignerTo(element: HTMLElement): void {
    ko.applyBindingsToNode(element, { component: "view-manager" }, null);
}
