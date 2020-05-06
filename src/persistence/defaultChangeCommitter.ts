import { ChangeCommitter } from "./changeCommitter";

export class DefaultChangeCommitter implements ChangeCommitter {
    public async commit(): Promise<void> {
        // Do noting
    }
}