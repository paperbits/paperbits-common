import { InlineModel } from "./inlineModel";

export class BlockModel {
    public attrs?: {
        styles?: object;
        className?: string;
        id?: string;
        name?: string;
        placeholder?: string;
    };

    public nodes?: InlineModel[];

    constructor(public readonly type: string) { }
}