import { Contract } from "@paperbits/common/contract";
import { MarkContract } from "./markContract";

export interface RangeContract extends Contract {
    marks: MarkContract;
}