import { IWidgetBinding } from "../editing";

/**
 * Widget binding used to connect widget model to its view model instance.
 */
export class WidgetBinding<TModel, TViewModel> implements IWidgetBinding<TModel, TViewModel> {
    /**
     * Name of the UI framework the widget is implemented with, e.g. `react`, `angular`, `vue`, `knockout`.
     */
    public framework: string;

    /**
     * Widget view model class.
     */
    public viewModelClass: new (...args: any[]) => TViewModel;

    /**
     * Instance of the view model associated with the widget.
     */
    public viewModel: TViewModel;

    /**
     * Instance of the model associated with the widget.
     */
    public model: TModel;

    /**
     * Name of a widget, e.g. `button`.
     */
    public name: string;

    /**
     * Widget display name, e.g. `Button`.
     */
    public displayName: string;

    /**
     * Indicates whethere the widget should appear editable in the designer.
     */
    public readonly: boolean;

    /**
     * Indicates whether the widget can be moved in the designer.
     */
    public draggable: boolean;

    /**
     * Registration name (tag name) of editor component.
     */
    public editor: string;

    /**
     * Propagates changes from widget model to widget view model.
     */
    public applyChanges?: (model: TModel, viewModel: TViewModel) => Promise<void>;

    /**
     * Callback invoked when the widget view model gets created.
     */
    public onCreate?: (viewModel?: TViewModel) => void;

    /**
     * Callback invoked when the widget view model gets displosed.
     */
    public onDispose?: (viewModel?: TViewModel) => void;
}