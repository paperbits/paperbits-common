export interface Contract {
    /**
     * Type of widget, e.g. "button".
     */
    type: string;

    /**
     * Child nodes of the widget.
     */
    nodes?: Contract[];
}