import "../extensions";
import { IEventManager } from "../events/IEventManager";

interface EventListener {
    eventName: string;
    eventHandler: (...args) => void;
}

export class DefaultEventManager implements IEventManager {
    private readonly eventListeners: Array<EventListener>;

    constructor() {
        this.eventListeners = [];
    }

    public addEventListener(eventName: string, eventHandler: (...args) => void): void {
        const exists = this.eventListeners.some(listener =>
            listener.eventName === eventName &&
            listener.eventHandler === eventHandler);

        if (!exists) {
            this.eventListeners.push({ eventName: eventName, eventHandler: eventHandler });
        }
    }

    public removeEventListener(eventName: string, eventHandler: (...args) => void): void {
        const listener = this.eventListeners.find(listener =>
            listener.eventName === eventName &&
            listener.eventHandler === eventHandler);

        if (listener) {
            this.eventListeners.remove(listener);
        }
    }

    public dispatchEvent(eventName: string, args?): void {
        this.eventListeners
            .filter(listener => listener.eventName === eventName)
            .forEach(x => x.eventHandler(args));
    }
}