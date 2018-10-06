export interface IPublisher {
    publish(): Promise<void>;
}