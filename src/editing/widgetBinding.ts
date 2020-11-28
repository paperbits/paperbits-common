import { IWidgetBinding } from "../editing";

export class WidgetBinding implements IWidgetBinding<any> {
    public framework: string;
    public viewModelClass: any;
    public viewModelInstance: any;
    public model: any;
    public name: string;
    public displayName: string;
    public readonly: boolean;
    public draggable: boolean;
    public editor: string;
    public applyChanges: (model: any) => Promise<void>;
}