export interface StyleDefinition {
    /**
     * e.g. `Button`.
     */
    displayName: string;

    /**
     * e.g. `hove`, `active`.
     */
    states: string[];

    /**
     * 
     */
    components: StyleDefinition;

    /**
     * e.g. `margin`, `padding`.
     */
    plugins: string[];
}