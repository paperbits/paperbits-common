
import { EventManager, Events } from "../events";
import { BehaviorHandle } from "./behavior";

export class LiveAreaBehavior {
    public static attach(element: HTMLElement, eventManager: EventManager): BehaviorHandle {
        const notificationHandler = (notification: string) => {
            element.innerText = notification;
        };

        eventManager.addEventListener(Events.NotificationRequest, notificationHandler);

        return {
            detach: () => {
                eventManager.removeEventListener(Events.NotificationRequest, notificationHandler);
            }
        };
    }
}
