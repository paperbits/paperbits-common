import { EventManager, Events } from "@paperbits/common/events";
import { ResizableOptions } from "@paperbits/common/ui/resizableOptions";
import { BehaviorHandle } from "./behavior";


export class ResizableBehavior {
    public static attach(element: HTMLElement, config: string | ResizableOptions, eventManager: EventManager): BehaviorHandle {
        let directions: string;
        let onResizeCallback: (() => void) | undefined;
        let initialWidthOption: number | undefined;
        let initialHeightOption: number | undefined;

        let initialEdge: string;
        let initialOffsetX: number, initialOffsetY: number;
        let currentElementWidth: number, currentElementHeight: number; // Renamed from initialWidth/Height to avoid confusion
        let initialLeft: number, initialRight: number, initialTop: number, initialBottom: number;
        let resizing = false;

        const resizeHandles: HTMLElement[] = [];
        const handleEventListeners: { element: HTMLElement, type: string, listener: (e: any) => void }[] = [];
        
        // Store references to pointerMove and pointerUp handlers for add/removeEventListener
        let pointerMoveHandlerRef: ((event: MouseEvent) => void) | null = null;
        let pointerUpHandlerRef: ((event: MouseEvent) => void) | null = null;

        const setOptions = (currentConfig: string | ResizableOptions) => {
            if (typeof currentConfig === "string") {
                directions = currentConfig;
                onResizeCallback = undefined;
                initialWidthOption = undefined;
                initialHeightOption = undefined;
            } else {
                directions = currentConfig.directions;
                onResizeCallback = currentConfig.onresize;
                initialWidthOption = currentConfig.initialWidth;
                initialHeightOption = currentConfig.initialHeight;

                if (initialWidthOption !== undefined) {
                    element.style.width = initialWidthOption + "px";
                }
                if (initialHeightOption !== undefined) {
                    element.style.height = initialHeightOption + "px";
                }
            }

            if (directions.includes("suspended")) {
                element.classList.add("resize-suspended");
                element.style.width = ""; 
                element.style.height = "";
            } else {
                element.classList.remove("resize-suspended");
            }
        };

        setOptions(config);

        const style = window.getComputedStyle(element);
        const minWidthNum = parseFloat(style.minWidth) || 0;
        const minHeightNum = parseFloat(style.minHeight) || 0;

        const onPointerMove = (event: MouseEvent): void => {
            if (!resizing) {
                return;
            }

            let newWidthPx: string | undefined;
            let newHeightPx: string | undefined;

            switch (initialEdge) {
                case "left":
                    let newWidthLeft = currentElementWidth + (initialOffsetX - event.clientX);
                    if (newWidthLeft < minWidthNum) {
                        newWidthLeft = minWidthNum;
                    }
                    newWidthPx = newWidthLeft + "px";
                    element.style.width = newWidthPx;
                    element.classList.add("resized-horizontally");
                    break;

                case "right":
                    let newWidthRight = currentElementWidth + (event.clientX - initialOffsetX);
                    if (newWidthRight < minWidthNum) {
                        newWidthRight = minWidthNum;
                    }
                    newWidthPx = newWidthRight + "px";
                    element.style.width = newWidthPx;
                    element.classList.add("resized-horizontally");
                    break;

                case "top":
                    let newHeightTop = currentElementHeight + (initialOffsetY - event.clientY);
                    if (newHeightTop < minHeightNum) {
                        newHeightTop = minHeightNum;
                    }
                    newHeightPx = newHeightTop + "px";
                    element.style.height = newHeightPx;
                    element.classList.add("resized-vertically");
                    break;

                case "bottom":
                    let newHeightBottom = currentElementHeight + (event.clientY - initialOffsetY);
                    if (newHeightBottom < minHeightNum) {
                        newHeightBottom = minHeightNum;
                    }
                    newHeightPx = newHeightBottom + "px";
                    element.style.height = newHeightPx;
                    element.classList.add("resized-vertically");
                    break;

                default:
                    // Should not happen
                    console.error(`Unexpected resizing initial edge: "${initialEdge}".`);
                    return;
            }
            eventManager.dispatchEvent("onEditorResize");
        };
        
        const onPointerUp = (event: MouseEvent): void => {
            resizing = false;
            if (pointerMoveHandlerRef) {
                eventManager.removeEventListener("onPointerMove", pointerMoveHandlerRef);
            }
            if (pointerUpHandlerRef) {
                eventManager.removeEventListener("onPointerUp", pointerUpHandlerRef);
            }
            pointerMoveHandlerRef = null;
            pointerUpHandlerRef = null;

            // Note: Original position style (fixed) is not reverted here, matching original behavior.
            // Classes "resized-horizontally"/"resized-vertically" also remain.

            if (onResizeCallback) {
                onResizeCallback();
            }
        };
        
        pointerMoveHandlerRef = onPointerMove;
        pointerUpHandlerRef = onPointerUp;

        const onPointerDown = (event: MouseEvent, edge: string): void => {
            if (directions === "none" || directions.includes("suspended") || resizing) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();
            
            if (pointerMoveHandlerRef && pointerUpHandlerRef) {
                eventManager.addEventListener("onPointerMove", pointerMoveHandlerRef);
                eventManager.addEventListener("onPointerUp", pointerUpHandlerRef);
            }

            resizing = true;
            const elementRect = element.getBoundingClientRect();

            initialEdge = edge;
            initialOffsetX = event.clientX;
            initialOffsetY = event.clientY;
            currentElementWidth = elementRect.width;
            currentElementHeight = elementRect.height;
            initialLeft = elementRect.left;
            initialRight = elementRect.right;
            initialTop = elementRect.top;
            initialBottom = elementRect.bottom;

            const bodyWidth = element.ownerDocument.body.clientWidth;
            const bodyHeight = element.ownerDocument.body.clientHeight;

            element.style.position = "fixed"; // This is a key part of the original behavior

            switch (initialEdge) {
                case "left":
                    element.style.left = "unset";
                    element.style.right = (bodyWidth - initialRight) + "px";
                    element.style.width = currentElementWidth + "px";
                    break;
                case "right":
                    element.style.right = "unset";
                    element.style.left = initialLeft + "px";
                    element.style.width = currentElementWidth + "px";
                    break;
                case "top":
                    element.style.top = "unset";
                    element.style.bottom = (bodyHeight - initialBottom) + "px";
                    element.style.height = currentElementHeight + "px";
                    break;
                case "bottom":
                    element.style.bottom = "unset";
                    element.style.top = initialTop + "px";
                    element.style.height = currentElementHeight + "px";
                    break;
            }
        };

        const createHandle = (edge: string, className: string): void => {
            const handle = element.ownerDocument.createElement("div");
            handle.classList.add("resize-handle", className);
            element.appendChild(handle);
            resizeHandles.push(handle);

            const onMouseDownListener = (e: MouseEvent) => onPointerDown(e, edge);
            handle.addEventListener(Events.MouseDown, onMouseDownListener); // Events.MouseDown is typically "mousedown"
            handleEventListeners.push({ element: handle, type: Events.MouseDown, listener: onMouseDownListener });
        };

        if (!directions.includes("suspended")) {
            if (directions.includes("top") || directions.includes("vertically")) {
                createHandle("top", "resize-handle-top");
            }
            if (directions.includes("bottom") || directions.includes("vertically")) {
                createHandle("bottom", "resize-handle-bottom");
            }
            if (directions.includes("left") || directions.includes("horizontally")) {
                createHandle("left", "resize-handle-left");
            }
            if (directions.includes("right") || directions.includes("horizontally")) {
                createHandle("right", "resize-handle-right");
            }
        }

        const detach = () => {
            if (resizing) { // If dispose is called mid-resize
                if (pointerMoveHandlerRef) {
                    eventManager.removeEventListener("onPointerMove", pointerMoveHandlerRef);
                }
                if (pointerUpHandlerRef) {
                    eventManager.removeEventListener("onPointerUp", pointerUpHandlerRef);
                }
            }
            pointerMoveHandlerRef = null;
            pointerUpHandlerRef = null;

            handleEventListeners.forEach(entry => {
                entry.element.removeEventListener(entry.type, entry.listener);
            });
            handleEventListeners.length = 0;

            resizeHandles.forEach(handle => {
                if (handle.parentElement) {
                    handle.parentElement.removeChild(handle);
                }
            });
            resizeHandles.length = 0;
            
            // Reset suspended class if it was added
            element.classList.remove("resize-suspended");
            // Note: other styles like position:fixed, width/height are not reset by dispose,
            // matching the original binding's behavior where KO's node disposal handles element cleanup.
        };

        return { detach: detach };
    }
}