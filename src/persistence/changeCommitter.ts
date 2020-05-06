export interface ChangeCommitter {
    commit(): Promise<void>;
}