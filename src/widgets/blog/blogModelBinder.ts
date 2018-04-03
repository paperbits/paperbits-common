import { IPermalinkService } from "./../../permalinks/IPermalinkService";
import { IBlogService } from "./../../blogs/IBlogService";
import { IRouteHandler } from "./../../routing/IRouteHandler";
import { BlogPostModel } from "./blogPostModel";
import { IViewModelBinder } from "./../IViewModelBinder";
import { IWidgetBinding } from "./../../editing/IWidgetBinding";
import * as Utils from '../../utils';
import { IFileService } from '../../files/IFileService';
import { BlogPostContract } from '../../blogs/blogPostContract';
import { SectionModelBinder } from "../section/sectionModelBinder";
import { SectionModel } from "../section/sectionModel";
import { Contract } from "./../../contract";
import { IModelBinder } from "../../editing/IModelBinder";
import { ISiteService } from "../../sites/ISiteService";
import { PlaceholderModel } from "../placeholder/placeholderModel";


export class BlogModelBinder implements IModelBinder {
    private readonly blogService: IBlogService;
    private readonly permalinkService: IPermalinkService;
    private readonly fileService: IFileService;
    private readonly sectionModelBinder: SectionModelBinder;
    private readonly routeHandler: IRouteHandler;
    private readonly siteService: ISiteService;

    constructor(blogService: IBlogService, permalinkService: IPermalinkService, fileService: IFileService, sectionModelBinder: SectionModelBinder, routeHandler: IRouteHandler, siteService: ISiteService) {
        this.blogService = blogService;
        this.permalinkService = permalinkService;
        this.fileService = fileService;
        this.sectionModelBinder = sectionModelBinder;
        this.routeHandler = routeHandler;
        this.siteService = siteService;

        // rebinding...
        this.nodeToModel = this.nodeToModel.bind(this);
    }

    public canHandleWidgetType(widgetType: string): boolean {
        return widgetType === "blog";
    }

    public canHandleModel(model: Object): boolean {
        return model instanceof BlogPostModel;
    }

    public async nodeToModel(blogPostContract: BlogPostContract): Promise<BlogPostModel> {
        if (!blogPostContract.key) {
            let currentUrl = this.routeHandler.getCurrentUrl();
            let permalink = await this.permalinkService.getPermalinkByUrl(currentUrl);
            let blogKey = permalink.targetKey;

            blogPostContract = await this.blogService.getBlogPostByKey(blogKey);
        }

        let blogModel = new BlogPostModel();
        blogModel.title = blogPostContract.title;
        blogModel.description = blogPostContract.description;
        blogModel.keywords = blogPostContract.keywords;

        let blogContentNode = await this.fileService.getFileByKey(blogPostContract.contentKey);
        let sectionModelPromises = blogContentNode.nodes.map(this.sectionModelBinder.nodeToModel);
        let sections = await Promise.all<SectionModel>(sectionModelPromises);
        blogModel.sections = sections;

        return blogModel;
    }

    public getConfig(blogModel: BlogPostModel): Contract {
        let blogConfig: Contract = {
            object: "block",
            type: "blog",
            nodes: []
        };
        blogModel.sections.forEach(section => {
            blogConfig.nodes.push(this.sectionModelBinder.getConfig(section));
        });

        return blogConfig;
    }

    public async updateContent(blogModel: BlogPostModel): Promise<void> {
        let url = this.routeHandler.getCurrentUrl();
        let permalink = await this.permalinkService.getPermalinkByUrl(url);
        let blogKey = permalink.targetKey;
        let blog = await this.blogService.getBlogPostByKey(blogKey);
        let file = await this.fileService.getFileByKey(blog.contentKey);
        let config = this.getConfig(blogModel);

        Object.assign(file, config);

        await this.fileService.updateFile(file);
    }
}
