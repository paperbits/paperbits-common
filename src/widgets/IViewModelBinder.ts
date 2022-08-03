import { Bag } from "../bag";
import { IWidgetBinding } from "../editing";

/**
 * This is a UI framework-specific utility that translates the widget model into
 * its view model (described by the component definition).
 */
export interface ViewModelBinder<TModel, TViewModel> {
    /**
     * Returns true if this view model binder can create view model out of model.
     * @param model This is data created by digesting config from contract. 
     */
    canHandleModel?(model: TModel): boolean;

    /**
     * @deprecated
     * Creates view model out of model.
     * @param model TModel This is data created by digesting config from contract.
     * @param existingViewModel If view model already exists, the binder will update it.
     */
    modelToViewModel?(model: TModel, existingViewModel?: TViewModel, bindingContext?: Bag<any>): Promise<TViewModel>;

    /**
     * Creates widget binding.
     * @param model {TModel} This is data created by digesting config from contract.
     * @param bindingContext {Bag<any>} Additional data passed from the top-level binding.
     */
    createWidgetBinding?<TViewModel>(model: TModel, bindingContext?: Bag<any>): Promise<IWidgetBinding<TModel, TViewModel>>;

    /**
     * AAA
     * @param state 
     * @param componentInstance 
     */
    stateToIntance?<TState, TInstance>(state: TState, componentInstance: TInstance): void;

    /**
     * BBB
     * @param model 
     * @param state 
     * @param bindingContext 
     */
    modelToState?<TState>(model: TModel, state: TState, bindingContext?: Bag<any>): Promise<void>;
}