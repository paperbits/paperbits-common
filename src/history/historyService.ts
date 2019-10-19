import { EventManager } from "../events";
import * as Objects from "../objects";

export class HistoryService {
    private readonly past = [];
    private readonly future = [];

    constructor(private readonly eventManager: EventManager) {
        this.eventManager.addEventListener("onUndo", () => this.undo());
    }

    public setValueAt(path: string, target: object, value: object, cleanNulls: boolean = true): void {
        let compensation;

        const doCommand = () => {
            compensation = Objects.getObjectAt(path, target);
            Objects.setValue(path, target, value);
        };

        const undoCommand = () => {
            Objects.setValue(path, target, compensation);
        };

        this.do(doCommand, undoCommand);
    }

    public merge(target: Object, changes: Object, stepCompleteCallback?: () => void): void {
        let compensation;

        const doCommand = () => {
            compensation = Objects.mergeDeep(target, changes);

            if (stepCompleteCallback) {
                stepCompleteCallback();
            }
        };

        const undoCommand = () => {
            Objects.mergeDeep(target, compensation);

            if (stepCompleteCallback) {
                stepCompleteCallback();
            }
        };

        this.do(doCommand, undoCommand);
    }

    public applyChangesAt(path: string, target: Object, changes: Object): void {
        let compensation;

        const doCommand = () => {
            compensation = Objects.mergeDeepAt(path, target, changes);
        };

        const undoCommand = () => {
            Objects.mergeDeep(target, compensation);
        };

        this.do(doCommand, undoCommand);
    }

    public do(doCommand, undoCommand): void {
        const record = { do: doCommand, undo: undoCommand };
        record.do();
        this.past.push(record);
    }

    public undo(): void {
        if (this.past.length === 0) {
            return;
        }

        const record = this.past.pop();
        record.undo();
        this.future.push(record);
    }

    public redo(): void {
        if (this.future.length === 0) {
            return;
        }

        const record = this.future.pop();
        record.do();
        this.past.push(record);
    }
}