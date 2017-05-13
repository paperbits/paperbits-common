import { IModel } from "./IModel";

export class MapModel implements IModel {
    type: string = "map";
    location: string;
    layout?: string;
    caption?: string;
    zoomControl?: string;
}