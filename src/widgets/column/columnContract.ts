import { Contract } from "../../contract";
import { Breakpoints } from "../../breakpoints";

export interface ColumnContract extends Contract {
    size?: Breakpoints;
    alignment?: Breakpoints;
}