import { IViewModelBinder } from "./IViewModelBinder";
import { MapModel } from "./models/mapModel";
import { IWidgetModel } from "../editing/IWidgetModel";
import { PermalinkService } from "../permalinks/permalinkService";
import { IMapConfig } from "./models/IMapNode";
import { IModelBinder } from "../editing/IModelBinder";

export class MapModelBinder implements IModelBinder {
    constructor() {
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "map";
    }

    public canHandleWidgetModel(model: Object): boolean {
        return model instanceof MapModel;
    }

    public async nodeToModel(mapNode: IMapConfig): Promise<MapModel> {
        let model = new MapModel();
        model.caption = mapNode.caption;
        model.layout = mapNode.layout;
        model.location = mapNode.location;
        model.zoomControl = mapNode.zoomControl;

        return model;
    }

    public async modelToWidgetModel(mapModel: MapModel, readonly: boolean = false): Promise<IWidgetModel> {
        let mapWidgetModel: IWidgetModel = {
            name: "paperbits-map",
            params: {},
            setupViewModel: (viewModel: IViewModelBinder) => {
                viewModel.attachToModel(mapModel);                
            },
            nodeType: "map",
            model: mapModel,
            editor: "paperbits-map-editor",
            readonly: readonly
        };

        return mapWidgetModel;
    }

    public getConfig(mapModel: MapModel): IMapConfig {
        let mapConfig: IMapConfig = {
            kind: "block",
            type: "map",
            caption: mapModel.caption,
            layout: mapModel.layout,
            location: mapModel.location,
            zoomControl: mapModel.zoomControl
        }

        return mapConfig;
    }
}