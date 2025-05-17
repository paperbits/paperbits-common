import { BehaviorHandle } from "./behavior";
import { Events } from "../events";

export interface AngleBehaviorOptions {
    /**
     * Callback function invoked when the angle changes.
     * @param angle The new angle in degrees (0-359).
     */
    onChange: (angle: number) => void;
}

export class AngleBehavior {
    public static attach(element: HTMLElement, options: AngleBehaviorOptions): BehaviorHandle {
        const rect = element.getBoundingClientRect();
        const centerX = Math.floor(rect.width / 2);
        const centerY = Math.floor(rect.height / 2);
        let tracking = false;

        const determineAngle = (x: number, y: number) => {
            const dx = centerX - x;
            const dy = centerY - y;
            let theta = Math.atan2(dy, dx) * 180 / Math.PI;
            theta += -90; // Adjusting to make 0 degrees at the top

            if (theta < 0) {
                theta += 360;
            }
            options.onChange(Math.floor(theta));
        };

        const onMouseDown = (event: MouseEvent) => {
            tracking = true;
            determineAngle(event.offsetX, event.offsetY);
        };

        const onMouseUp = (event: MouseEvent) => {
            if (tracking) { // Only determine angle if tracking was active
                determineAngle(event.offsetX, event.offsetY);
            }
            tracking = false;
        };

        const onMouseMove = (event: MouseEvent) => {
            if (!tracking) {
                return;
            }
            determineAngle(event.offsetX, event.offsetY);
        };
        
        const onMouseLeave = (event: MouseEvent) => {
            // Optional: if you want tracking to stop if mouse leaves the element
            // if (tracking) {
            //     determineAngle(event.offsetX, event.offsetY); // Update one last time
            // }
            // tracking = false;
        };

        element.addEventListener(Events.MouseDown, onMouseDown);
        // Listen to mouseup and mousemove on the document or a specific capturing parent 
        // to handle cases where the mouse is released outside the element.
        // However, the original code listened on the element itself for mouseup and mousemove with capture=true.
        // For now, sticking to element listeners as per original, but document-level listeners are often more robust for dragging.
        document.addEventListener(Events.MouseUp, onMouseUp, true); // Changed to document to ensure mouseup is caught
        document.addEventListener(Events.MouseMove, onMouseMove, true); // Changed to document for better tracking experience
        // element.addEventListener(Events.MouseLeave, onMouseLeave); // Optional: see comment above

        return {
            detach: () => {
                element.removeEventListener(Events.MouseDown, onMouseDown);
                document.removeEventListener(Events.MouseUp, onMouseUp, true);
                document.removeEventListener(Events.MouseMove, onMouseMove, true);
                // element.removeEventListener(Events.MouseLeave, onMouseLeave);
                tracking = false; // Ensure tracking is reset
            }
        };
    }
}
