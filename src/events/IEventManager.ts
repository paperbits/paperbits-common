export interface IEventManager {
    addEventListener(eventName: string, eventHandler: (args?) => void): void;
    removeEventListener(eventName: string, eventHandler: (args?) => void): void;
    dispatchEvent(eventName: string, args?): void;
}