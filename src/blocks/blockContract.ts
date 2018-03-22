import { Contract } from "../contract";

export interface BlockContract extends Contract {
    key?: string;
    title: string;
    description: string;
    content: Contract;
}