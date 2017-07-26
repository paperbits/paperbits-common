import { IPermalinkService } from "./../permalinks/IPermalinkService";
import { IBlogService } from "./../blogs/IBlogService";
import { IRouteHandler } from "./../routing/IRouteHandler";
import { BlogPostModel } from "./models/blogPostModel";
import { IViewModelBinder } from "./IViewModelBinder";
import { IWidgetModel } from "./../editing/IWidgetModel";
import * as Utils from '../core/utils';
import { IFile } from '../files/IFile';
import { IFileService } from '../files/IFileService';
import { IBlogPost } from '../blogs/IBlogPost';
import { SectionModelBinder } from "../widgets/sectionModelBinder";
import { SectionModel } from "../widgets/models/sectionModel";
import { ContentConfig } from "./../editing/contentNode";
import { IModelBinder } from "../editing/IModelBinder";
import { ISiteService } from "../sites/ISiteService";
import { PlaceholderModel } from "./models/placeholderModel";

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

    public async nodeToModel(blogConfig: IBlogPost): Promise<BlogPostModel> {
        if (!blogConfig.key) {
            let currentUrl = this.routeHandler.getCurrentUrl();
            let permalink = await this.permalinkService.getPermalinkByUrl(currentUrl);
            let blogKey = permalink.targetKey;

            blogConfig = await this.blogService.getBlogPostByKey(blogKey);
        }

        let blogModel = new BlogPostModel();
        blogModel.title = blogConfig.title;
        blogModel.description = blogConfig.description;
        blogModel.keywords = blogConfig.keywords;

        let blogContentNode = await this.fileService.getFileByKey(blogConfig.contentKey);
        let sectionModelPromises = blogContentNode.nodes.map(this.sectionModelBinder.nodeToModel);
        let sections = await Promise.all<SectionModel>(sectionModelPromises);
        blogModel.sections = sections;

        let settings = await this.siteService.getSiteSettings();
        document.title = `${settings.title} | ${blogModel.title}`;

        return blogModel;
    }

    public getConfig(blogModel: BlogPostModel): ContentConfig {
        let blogConfig: ContentConfig = {
            kind: "block",
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
