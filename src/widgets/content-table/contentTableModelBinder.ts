import { IPermalinkService } from "./../../permalinks/IPermalinkService";
import { IPageService } from "./../../pages/IPageService";
import { Contract } from "./../../contract";
import { IModelBinder } from "../../editing/IModelBinder";
import { ContentTableModel } from "./contentTableModel";
import { HyperlinkModel } from "../../permalinks/hyperlinkModel";

export class ContentTableModelBinder implements IModelBinder {
    private readonly pageService: IPageService;
    private readonly permalinkService: IPermalinkService;

    constructor(pageService: IPageService, permalinkService: IPermalinkService) {
        this.pageService = pageService;
        this.permalinkService = permalinkService;
        this.nodeToModel = this.nodeToModel.bind(this);
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "content-table";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof ContentTableModel;
    }

    public async nodeToModel(contentTableContract: { object: string, type: string, title?: string, targetPermalinkKey: string }): Promise<ContentTableModel> {
        let type = "content-table";
        
        let contentTableModel = new ContentTableModel();
        contentTableModel.title = contentTableContract.title;
        contentTableModel.targetPermalinkKey = contentTableContract.targetPermalinkKey;
        if (contentTableContract.targetPermalinkKey) {
            const pagePermalink = await this.permalinkService.getPermalink(contentTableContract.targetPermalinkKey);
            const page = await this.pageService.getPageByKey(pagePermalink.targetKey);
            
            if (page.anchors) {
                contentTableModel.items = [];
                Object.keys(page.anchors).forEach(async anchorKey => {
                    const permalinkKey = anchorKey.replaceAll("|", "/");
                    console.log("permalinkKey: "+ permalinkKey);
                    const anchorPermalink = await this.permalinkService.getPermalink(permalinkKey);

                    let hyperlinkModel = new HyperlinkModel();
                    hyperlinkModel.title = page.anchors[anchorKey];//`${page.title} > ${page.anchors[anchorKey]}`;
                    hyperlinkModel.permalinkKey = permalinkKey;
                    hyperlinkModel.href = `${pagePermalink.uri}#${anchorPermalink.uri}`;
                    hyperlinkModel.type = "anchor";

                    contentTableModel.items.push(hyperlinkModel);
                });
                
            }                       
        }
        return contentTableModel;
    }

    public getConfig(contentTableModel: ContentTableModel): Contract {
        let contentTableConfig: Contract = {
            object: "block",
            type: "content-table",
            title: contentTableModel.title,
            targetPermalinKey: contentTableModel.targetPermalinkKey
        };

        return contentTableConfig;
    }
}
