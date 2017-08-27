import { IWidgetBinding } from "./IWidgetBinding";
import { IWidgetFactoryResult } from '../editing/IWidgetFactoryResult';
import { IWidgetOrder } from '../editing/IWidgetOrder';

export interface IWidgetOrder { //to be displayed in UI and enough to build new HTML element
    title: string;
    createWidget(): IWidgetFactoryResult;
    createModel(): any;
}
