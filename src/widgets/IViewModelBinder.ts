export interface IViewModelBinder {
    attachToModel?<T>(model:T): void;
}