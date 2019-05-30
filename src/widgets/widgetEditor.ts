/**
 * Common interface for widget editors.
 */
export interface WidgetEditor<T> {
    initialize(): void;

    /**
     * Widget model.
     */
    model: T;

    /**
     * An event invoked when editor completes model changes.
     * @param model Widget model.
     */
    onChange: (model: T) => void;
}