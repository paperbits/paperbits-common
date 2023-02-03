import * as Html from "../html";
import { EventManager } from "../events";
import { View } from "./view";

export class ViewStack {
    private stack: View[];

    constructor(private readonly eventManager: EventManager) {
        this.stack = [];
        this.eventManager.addEventListener("onPointerDown", this.onPointerDown.bind(this));
        this.eventManager.addEventListener("onEscape", this.popView.bind(this));
    }

    private onPointerDown(event: MouseEvent): void {
        const targetElement = <HTMLElement>event.target;
        this.runHitTest(targetElement);
    }

    public runHitTest(targetElement: HTMLElement): void {
        const views = [...this.stack]; // clone array

        for (const view of views.reverse()) {
            let hit: boolean;

            if (view.hitTest) {
                hit = view.hitTest(targetElement);
            }
            else {
                hit = !!Html.closest(targetElement, (node: HTMLElement) => node === view.element);
            }

            if (hit) {
                break;
            }

            this.stack.pop();
            view.close();
        }
    }

    /**
     * Pushes the view to the top of the stack.
     */
    public pushView(view: View): void {
        this.stack.push(view);
    }

    /**
     * Removes the top view from the stack.
     */
    public popView(): void {
        const view = this.stack.pop();

        if (!view) {
            this.eventManager.dispatchEvent("onTopLevelEscape");
            return;
        }

        view.close();

        if (view.returnFocusTo) {
            view.returnFocusTo.focus();
        }
    }

    /**
     * Removes specified view and all its children from the stack.
     * @param view - A view to be removed.
     */
    public removeView(view: View): void {
        if (!this.stack.includes(view)) {
            return;
        }

        let topView: View;

        do {
            topView = this.stack.pop();
            topView.close();
        }
        while (!topView || topView !== view);

        if (!topView) {
            this.eventManager.dispatchEvent("onTopLevelEscape");
            return;
        }

        if (topView.returnFocusTo) {
            view.returnFocusTo.focus();
        }
    }

    /**
     * Returns all views in the stack.
     */
    public getViews(): View[] {
        return [...this.stack]; // clone array
    }

    /**
     * Clears the view stack.
     */
    public clear(): void {
        this.stack.forEach(view => view.close());
        this.stack = [];
    }
}