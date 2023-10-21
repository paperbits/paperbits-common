import { Contract } from "@paperbits/common";

export interface WidgetMigration {
    schemaVersion: number;
    migrate(theme: Contract): Promise<void>;
}