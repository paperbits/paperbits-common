/**
 * This is a UI framework specific entity that knows how to create View model out of model.
 */
export interface IViewModelBinder {
    /**
     * Returns true if this view model binder can create view model out of model.
     * @param model This is data created by digesting config from contract. 
     */
    canHandleModel?<T>(model: T): boolean;

    /**
     * Creates view model out of model.
     * @param model TModel This is data created by digesting config from contract.
     * @param readonly Tells editors if it cam be edited.
     * @param existingViewModel If view model already exists, the binder will update it.
     */
    modelToViewModel?<TModel, TViewModel>(model: TModel, readonly: boolean, existingViewModel?: TViewModel): TViewModel;
}