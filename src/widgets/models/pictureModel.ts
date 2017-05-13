import { IModel } from "./IModel";

export class PictureModel implements IModel {
    public type: string = "picture";
    public sourceUrl: string;
    public caption: string;
    public action: string;
    public layout: string;
    public animation: string;
    public sourceKey: string;
}