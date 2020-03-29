import { Contract } from "../..";

/**
 * Mark, e.g. "bold", "italic", "underlined", etc.
 */
export interface MarkContract extends Contract {
    /**
     * Data associated with an instance of the mark.
     */
    attrs?: object;
}