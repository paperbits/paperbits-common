import { Bag } from "../bag";
import { IWidgetBinding } from "../editing";

/**
 * This is a UI framework-specific utility that translates the widget model into
 * its view model (described by the component definition).
 */
export interface ViewModelBinder<TModel, TViewModel> {
    /**
     * @deprecated Please use `modelToState` and `stateToIntance` methods instead.
     * @param model This is data created by digesting config from contract. 
     */
    canHandleModel?(model: TModel): boolean;

    /**
     * @deprecated Please use `modelToState` and `stateToIntance` methods instead.
     * @param model TModel This is data created by digesting config from contract.
     * @param existingViewModel If view model already exists, the binder will update it.
     * @param bindingContext {Bag<any>} Binding context, which carries additional information passed from the root component.
     */
    modelToViewModel?(model: TModel, existingViewModel?: TViewModel, bindingContext?: Bag<any>): Promise<TViewModel>;

    /**
     * @deprecated Please use `modelToState` and `stateToIntance` methods instead.
     * @param model {TModel} This is data created by digesting config from contract.
     * @param bindingContext {Bag<any>} Additional data passed from the top-level binding.
     */
    createWidgetBinding?<TViewModel>(model: TModel, bindingContext?: Bag<any>): Promise<IWidgetBinding<TModel, TViewModel>>;

    /**
     * Translates the widget state to its instance during rendering. This operation should not contain asynchronous operations
     * due to server-side rendering requirements applied at the publishing time.
     * @param state {TState} Widget state object.
     * @param componentInstance {TInstance} Instance of the widget component.
     */
    stateToIntance?<TState, TInstance>(state: TState, componentInstance: TInstance): void;

    /**
     * Converts the widget model into the widget state object used later on during component rendering.
     * @param model {TModel} Instance of widget model.
     * @param state {TState} Widget state object.
     * @param bindingContext {Bag<any>} Binding context, which carries additional information passed from the root component.
     */
    modelToState?<TState>(model: TModel, state: TState, bindingContext?: Bag<any>): Promise<void>;
}