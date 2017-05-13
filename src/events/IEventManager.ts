export interface IEventManager {
    addEventListener(eventName: string, callback: any): void;
    removeEventListener(eventName: string, callback: any): void;
    dispatchEvent(eventName: string): void;
    dispatchEvent(eventName: string, args: any): void;
}