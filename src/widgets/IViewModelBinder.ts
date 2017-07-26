export interface IViewModelBinder {
    canHandleModel?<T>(model: T): boolean;
    modelToViewModel?<TModel, TViewModel>(model: TModel, readonly: boolean, updatedViewModel?: TViewModel): TViewModel;
}