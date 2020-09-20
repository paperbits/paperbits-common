import * as _ from "lodash";
import * as Utils from "../utils";
import { Bag } from "./../bag";
import { BlogPostContract } from "../blogs/blogPostContract";
import { IBlogService } from "../blogs/IBlogService";
import { IObjectStorage, Query, Operator } from "../persistence";
import { IBlockService } from "../blocks";
import { Contract } from "..";

const blogPostsPath = "posts";
const documentsPath = "files";
const templateBlockKey = "blocks/new-page-template";

export class BlogService implements IBlogService {
    constructor(
        private readonly objectStorage: IObjectStorage,
        private readonly blockService: IBlockService
    ) { }

    public async getBlogPostByPermalink(permalink: string): Promise<BlogPostContract> {
        if (!permalink) {
            throw new Error(`Parameter "permalink" not specified.`);
        }

        const query = Query
            .from<BlogPostContract>()
            .where("permalink", Operator.equals, permalink);

        const pageOfObjects = await this.objectStorage.searchObjects<BlogPostContract>(blogPostsPath, query);
        const result = pageOfObjects.value;
        const posts = Object.values(result);

        return posts.length > 0 ? posts[0] : null;
    }

    public async getBlogPostByKey(key: string): Promise<BlogPostContract> {
        return await this.objectStorage.getObject<BlogPostContract>(key);
    }

    public async search(pattern: string): Promise<BlogPostContract[]> {
        const query = Query
            .from<BlogPostContract>()
            .where("title", Operator.contains, pattern)
            .orderBy("title");

        const pageOfObjects = await this.objectStorage.searchObjects<BlogPostContract>(blogPostsPath, query);
        const result = pageOfObjects.value;

        return result;
    }

    public async deleteBlogPost(blogPost: BlogPostContract): Promise<void> {
        const deleteContentPromise = this.objectStorage.deleteObject(blogPost.contentKey);
        const deleteBlogPostPromise = this.objectStorage.deleteObject(blogPost.key);

        await Promise.all([deleteContentPromise, deleteBlogPostPromise]);
    }

    public async createBlogPost(url: string, title: string, description: string, keywords: string): Promise<BlogPostContract> {
        const identifier = Utils.guid();
        const postKey = `${blogPostsPath}/${identifier}`;
        const contentKey = `${documentsPath}/${identifier}`;

        const post: BlogPostContract = {
            key: postKey,
            title: title,
            description: description,
            keywords: keywords,
            permalink: url,
            contentKey: contentKey
        };

        await this.objectStorage.addObject(postKey, post);

        const template = await this.blockService.getBlockContent(templateBlockKey);

        await this.objectStorage.addObject(contentKey, template);

        return post;
    }

    public async updateBlogPost(blogPost: BlogPostContract): Promise<void> {
        await this.objectStorage.updateObject<BlogPostContract>(blogPost.key, blogPost);
    }

    public async getBlogPostContent(postKey: string): Promise<Contract> {
        const page = await this.getBlogPostByKey(postKey);
        return await this.objectStorage.getObject(page.contentKey);
    }

    public async updateBlogPostContent(postKey: string, content: Contract): Promise<void> {
        if (!postKey) {
            throw new Error(`Parameter "postKey" not specified.`);
        }

        if (!content) {
            throw new Error(`Parameter "content" not specified.`);
        }

        const page = await this.getBlogPostByKey(postKey);
        this.objectStorage.updateObject(page.contentKey, content);
    }
}
