export interface IResourceSelector<T> {
    onSelect: (resource: T) => void;
    selectResource?(resource: T): void;
}