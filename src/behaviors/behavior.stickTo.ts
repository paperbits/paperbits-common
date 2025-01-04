
import { ViewManager, ViewManagerMode } from "../ui";
import { Events } from "../events";
import { BehaviorHandle } from "./behavior";

export enum StickToPlacement {
    border = "border",
    outside = "outside"
}

export interface StickToConfig {
    /**
     * Target element.
     */
    target: HTMLElement;

    /**
     * Element position, e.g. `top`, `bottom`, `left`, `right`, `center`.
     */
    position: string;

    /**
     * border (default), outside
     */
    placement: StickToPlacement;

    /**
     * Horizontal offset from the assigned position.
     */
    offsetX: number;

    /**
     * Vertical offset from the assigned position.
     */
    offsetY: number;
}

export class StickToBehavior {
    public static attach(element: HTMLElement, config: StickToConfig, viewManager: ViewManager): BehaviorHandle {
        const updatePosition = () => {
            if (!config.target) {
                return;
            }

            if (viewManager.mode !== ViewManagerMode.selecting && viewManager.mode !== ViewManagerMode.selected) {
                return;
            }

            const frameElement = config.target.ownerDocument.defaultView.frameElement;

            if (!frameElement) {
                return;
            }

            const offsetX = config.offsetX || 0;
            const offsetY = config.offsetY || 0;
            const anchors = config.position.split(" ");

            const frameRect = frameElement.getBoundingClientRect();
            const targetRect = config.target.getBoundingClientRect();

            const placement = config.placement || StickToPlacement.border;
            let coordX: number;
            let coordY: number;

            element.style.right = null;
            element.style.left = null;

            coordX = targetRect.left + Math.floor((targetRect.width) / 2) - Math.floor(element.clientWidth / 2);
            coordY = targetRect.top + Math.floor((targetRect.height) / 2) - Math.floor(element.clientHeight / 2);

            if (anchors.includes("top")) {
                coordY = targetRect.top - offsetY;

                switch (placement) {
                    case StickToPlacement.border:
                        coordY = coordY - Math.floor(element.clientHeight / 2);
                        break;

                    case StickToPlacement.outside:
                        coordY = coordY - element.clientHeight;
                        break;
                }

                if (coordY < 0) { // keeping the element within viewport
                    coordY = 0
                }
            }

            if (anchors.includes("bottom")) {
                coordY = targetRect.top + offsetY + targetRect.height - element.clientHeight;

                switch (placement) {
                    case StickToPlacement.border:
                        coordY = coordY + Math.floor(element.clientHeight / 2);
                        break;

                    case StickToPlacement.outside:
                        coordY = coordY + element.clientHeight;
                        break;
                }
            }

            element.style.top = frameRect.top + coordY + "px";



            if (anchors.includes("left")) {
                element.style.left = frameRect.left + targetRect.left + offsetX + "px";
            }
            else if (anchors.includes("right")) {
                element.style.right = frameRect.right - targetRect.right + offsetX + "px";
            }
            else {
                element.style.left = frameRect.left + coordX + "px";
            }

            if (anchors.includes("parent-left")) {
                if (!config.target.parentElement) {
                    return;
                }

                const targetParentRect = config.target.parentElement.getBoundingClientRect();
                element.style.left = targetParentRect.left - Math.floor(element.clientWidth / 2) + "px";
            }

            if (anchors.includes("parent-top")) {
                if (!config.target.parentElement) {
                    return;
                }

                const targetParentRect = config.target.parentElement.getBoundingClientRect();
                element.style.top = targetParentRect.top - Math.floor(element.clientHeight / 2) + "px";
            }

            setTimeout(() => {
                const elementRect = element.getBoundingClientRect();

                console.log(elementRect);

                if (elementRect.left < 0) {
                    element.style.left = "0px";
                    element.style.right = null
                }
            }, 10);
        };

        updatePosition();

        const onScroll = async (event: MouseEvent): Promise<void> => {
            requestAnimationFrame(updatePosition);
        };

        window.addEventListener(Events.Scroll, onScroll, true);

        return {
            detach: () => {
                window.removeEventListener(Events.Scroll, onScroll, true);
            }
        };
    }
}
