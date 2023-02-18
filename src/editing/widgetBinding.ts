import { ComponentBinder, ComponentFlow } from "../components";
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
     * Component binder.
     */
    public componentBinder: ComponentBinder;

    /**
     * Widget view model class.
     */
    public componentDefinition: unknown;

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
     * Indicates if the widget gets ignored by the designer.
     */
    public readonly: boolean;

    /**
     * Name of the layer the widget resides in.
     */
    public layer: string;

    /**
     * Indicates if the widget can be moved in the designer.
     */
    public draggable?: boolean;

    /**
     * Indicates if the widget can be selected in the designer.
     */
    public selectable?: boolean;

    /**
     * Editor component registration.
     */
    public editor: string | Function;

    /**
     * Editor component binder.
     */
    public editorComponentBinder?: ComponentBinder;

    /**
     * Editor window resizing options, e.g. `vertically horizontally`.
     */
    public editorResizing?: boolean | string;

    /**
     * Indicates that scroll is required on overflow. Default: `true`.
     */
    public editorScrolling?: boolean | string;

    /**
     * Widget handler used by the designer.
     */
    public handler?: Function;

    /**
     * Indicates if a component element needs to be wrapped into another DIV element. Certain frameworks (like Knockout)
     * do not replace a root element when initializing a component, and hence, may need a wrapper).
     */
    public wrapper?: ComponentFlow;

    /**
     * Propagates changes from widget model to widget view model.
     */
    public applyChanges?: (model: TModel, viewModel: TViewModel) => Promise<void>;

    /**
     * Callback invoked when the widget view model gets created.
     */
    public onCreate?: (viewModel?: TViewModel) => void;

    /**
     * Callback invoked when the widget view model gets disposed.
     */
    public onDispose?: (viewModel?: TViewModel) => void;

    /**
     * @deprecated Need to get rid of this property.
     */
    public wrapped: boolean;

    constructor() {
        this.wrapped = true;
    }
}