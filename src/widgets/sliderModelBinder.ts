import { SliderModel, SlideModel } from "./models/sliderModel";
import { ModelBinderSelector } from "./modelBinderSelector";
import { IModelBinder } from "../editing/IModelBinder";
import { ContentConfig } from "../editing/contentNode";
import { RowModel } from "./models/rowModel";
import { RowModelBinder } from "./rowModelBinder";
import { BackgroundModel } from "./models/backgroundModel";
import { IPermalinkResolver } from "../permalinks/IPermalinkResolver";
import { BackgroundModelBinder } from "./backgroundModelBinder";

export interface SliderContract {
}

export class SliderModelBinder implements IModelBinder {
    private readonly rowModelBinder: RowModelBinder;
    private readonly backgroundModelBinder: BackgroundModelBinder;

    constructor(rowModelBinder: RowModelBinder, backgroundModelBinder: BackgroundModelBinder) {
        this.rowModelBinder = rowModelBinder;
        this.backgroundModelBinder = backgroundModelBinder;
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "slider";
    }

    public canHandleModel(model): boolean {
        return model instanceof SliderModel;
    }

    public async nodeToModel(sliderContract: ContentConfig): Promise<SliderModel> {
        let sliderModel = new SliderModel();

        sliderContract.slides = [{
            type: "slide",
            nodes: [{
                type: "layout-row",
                nodes: [{
                    type: "layout-column",
                    size: {
                        lg: 12
                    },
                    nodes: [{
                        kind: "widget",
                        nodes: [
                            {
                                kind: "block",
                                type: "heading-three",
                                nodes: [{
                                    kind: "text",
                                    text: "Slide 1"
                                }]
                            }
                        ],
                        type: "text"
                    }]
                }]
            }],
            background: {
                color: "section-bg-2"
            }
        },
        {
            type: "slide",
            nodes: [{
                type: "layout-row",
                nodes: [{
                    type: "layout-column",
                    size: {
                        lg: 12
                    },
                    nodes: [{
                        kind: "widget",
                        nodes: [
                            {
                                kind: "block",
                                type: "heading-three",
                                nodes: [{
                                    kind: "text",
                                    text: "Slide 2"
                                }]
                            }
                        ],
                        type: "text"
                    }]
                }]
            }],
            background: {
                color: "section-bg-2"
            }
        }]

        if (sliderContract.slides) {
            let modelPromises = sliderContract.slides.map(async slideContract => {
                let slideModel = new SlideModel();
                let rowModelPromises = slideContract.nodes.map(this.rowModelBinder.nodeToModel);

                slideModel.rows = await Promise.all<RowModel>(rowModelPromises);

                if (slideContract.background) {
                    slideModel.background = await this.backgroundModelBinder.nodeToModel(slideContract.background);
                }

                slideModel.layout = slideContract.layout || "container";
                slideModel.padding = slideContract.padding || "with-padding";

                return slideModel;
            });

            let slideModels = await Promise.all<any>(modelPromises);
            sliderModel.slides = slideModels;
        }

        return sliderModel;
    }

    public getConfig(sliderModel: SliderModel): ContentConfig {
        let sliderConfig: ContentConfig = {
            type: "slider",
            kind: "block",
            nodes: sliderModel.slides.map(slideModel => {
                let slideConfig: ContentConfig = {
                    type: "layout-section",
                    kind: "block",
                    nodes: [],
                    layout: slideModel.layout,
                    padding: slideModel.padding,
                    background: {
                        color: slideModel.background.colorKey,
                        size: slideModel.background.size,
                        position: slideModel.background.position
                    }
                };

                if (slideModel.background.sourceType === "picture") {
                    slideConfig.background.picture = {
                        sourcePermalinkKey: slideModel.background.sourceKey,
                        repeat: slideModel.background.repeat
                    }
                }

                slideModel.rows.forEach(row => {
                    slideConfig.nodes.push(this.rowModelBinder.getRowConfig(row));
                });

                return slideConfig;
            })
        }

        return sliderConfig;
    }
}
