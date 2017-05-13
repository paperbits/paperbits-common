export interface IResourceSelector<T> {
    onResourceSelected: (resource: T) => void;
    selectResource?(resource: T);
}