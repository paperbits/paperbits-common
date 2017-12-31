import { Contract } from "../editing/contentNode";

export interface IBlock {
    key?: string;
    title: string;
    description: string;
    content: Contract;
}