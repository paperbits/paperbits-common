import { BlockModel } from "./blockModel";
import { ListItemModel } from "./listItemModel";

export class ListModel extends BlockModel {
    public nodes: ListItemModel[];

    constructor(type: string) { 
        super(type);
    }
}
