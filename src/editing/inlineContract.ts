import { Contract } from "../contract";
import { MarkContract } from "./markContract";

export interface InlineContract extends Contract {
    text?: string;
    marks?: MarkContract[];
    leaves?: InlineContract[];
}