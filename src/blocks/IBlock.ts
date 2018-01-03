import { Contract } from "../contract";

export interface IBlock {
    key?: string;
    title: string;
    description: string;
    content: Contract;
}