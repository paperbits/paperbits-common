import { Contract } from "../../contract";

export class PlaceholderModel {
    constructor(public readonly contract: Contract, public readonly message?: string) { }
}