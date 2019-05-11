import { BlockModel } from "./blockModel";

export class ListItemModel extends BlockModel {
    public nodes: BlockModel[];
    public type = "list-item"; // TODO: ProseMirror artifact
}
