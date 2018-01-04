import { IViewModelBinder } from "./../IViewModelBinder";
import { MapModel } from "./mapModel";
import { IWidgetBinding } from "../../editing/IWidgetBinding";
import { PermalinkService } from "../../permalinks/permalinkService";
import { IMapConfig } from "./mapContract";
import { IModelBinder } from "../../editing/IModelBinder";


export class MapModelBinder implements IModelBinder {
    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "map";
    }

    public canHandleModel(model: Object): boolean {
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