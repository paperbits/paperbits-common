import { Contract } from "../contract";
import { MarkContract } from "./markContract";

export interface RangeContract extends Contract {
    marks: MarkContract;
}