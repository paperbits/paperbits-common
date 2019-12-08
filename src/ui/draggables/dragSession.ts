import { IWidgetBinding } from "../../editing";
import { WidgetModel } from "../../widgets";


export interface DragSession {
    /**
     * Source element the dagging has started from.
     */
    sourceElement?: Element;

    /**
     * Model attached to dragged (source) element.
     */
    sourceModel: WidgetModel;

    /**
     * Widget binding attached to source element.
     */
    sourceBinding?: IWidgetBinding<any>;

    /**
     * Model attached to parent of dragged element.
     */
    sourceParentModel?: WidgetModel;

    /**
     * A binding of parent widget.
     */
    sourceParentBinding?: IWidgetBinding<any>;

    /**
     * Where to insert element in parent?
     */
    insertIndex?: number;

    /**
     * Accepting element.
     */
    targetElement?: Element;

    /**
     * Widget binding of accepting element.
     */
    targetBinding?: IWidgetBinding<any>;
}