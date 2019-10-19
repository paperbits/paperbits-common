/**
 * Manager for creating and dispatching events.
 */
export interface EventManager {
    /**
     * Adds listener for specified event.
     */
    addEventListener(eventName: string, eventHandler: (args?: any) => void): void;

    /**
     * Removes listener of specified event.
     */
    removeEventListener(eventName: string, eventHandler: (args?: any) => void): void;

    /**
     * Dispatches an event to all registered listeners.
     */
    dispatchEvent(eventName: string, args?: any): void;
}