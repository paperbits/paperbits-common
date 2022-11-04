import { Contract } from "@paperbits/common";
import { WidgetModel, ModelBinderSelector, IWidgetService } from "@paperbits/common/widgets";


export class ContainerModelBinder {
    constructor(
        protected readonly widgetService: IWidgetService,
        protected readonly modelBinderSelector: ModelBinderSelector
    ) { }

    public async getChildModels(nodes: Contract[] = [], bindingContext: any): Promise<any[]> {
        if (!nodes) {
            return [];
        }

        const modelPromises = nodes.map((contract: Contract) => {
            let modelBinder = this.widgetService.getModelBinder(contract.type);

            if (!modelBinder) {
                modelBinder = this.modelBinderSelector.getModelBinderByContract<any>(contract);
            }

            return modelBinder.contractToModel(contract, bindingContext);
        });

        return await Promise.all<any>(modelPromises);
    }

    public getChildContracts(models: WidgetModel[]): Contract[] {
        const nodes: Contract[] = [];

        models.forEach(widgetModel => {
            let modelBinder = this.widgetService.getModelBinderForModel(widgetModel);

            if (!modelBinder) {
                modelBinder = this.modelBinderSelector.getModelBinderByModel(widgetModel);
            }

            nodes.push(modelBinder.modelToContract(widgetModel));
        });

        return nodes;
    }
}
