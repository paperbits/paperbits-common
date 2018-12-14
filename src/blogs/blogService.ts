import * as _ from "lodash";
import * as Utils from "../utils";
import { BlogPostContract } from "../blogs/BlogPostContract";
import { IBlogService } from "../blogs/IBlogService";
import { IObjectStorage } from "../persistence/IObjectStorage";
import { IBlockService } from "../blocks";
import { Contract } from "..";

const blogPostsPath = "posts";
const documentsPath = "files";
const templateBlockKey = "blocks/8730d297-af39-8166-83b6-9439addca789";

export class BlogService implements IBlogService {
    constructor(
        private readonly objectStorage: IObjectStorage,
        private readonly blockService: IBlockService
    ) { }

    private async searchByTags(tags: string[], tagValue: string, startAtSearch: boolean): Promise<BlogPostContract[]> {
        return await this.objectStorage.searchObjects<BlogPostContract>(blogPostsPath, tags, tagValue, startAtSearch);
    }

    public async getBlogPostByPermalink(permalink: string): Promise<BlogPostContract> {
        const posts = await this.objectStorage.searchObjects<any>(blogPostsPath, ["permalink"], permalink);
        return posts.length > 0 ? posts[0] : null;
    }

    public async getBlogPostByKey(key: string): Promise<BlogPostContract> {
        return await this.objectStorage.getObject<BlogPostContract>(key);
    }

    public search(pattern: string): Promise<BlogPostContract[]> {
        return this.searchByTags(["title"], pattern, true);
    }

    public async deleteBlogPost(blogPost: BlogPostContract): Promise<void> {
        const deleteContentPromise = this.objectStorage.deleteObject(blogPost.contentKey);
        const deleteBlogPostPromise = this.objectStorage.deleteObject(blogPost.key);

        await Promise.all([deleteContentPromise, deleteBlogPostPromise]);
    }

    public async createBlogPost(url: string, title: string, description: string, keywords): Promise<BlogPostContract> {
        const identifier = Utils.guid();
        const postKey = `${blogPostsPath}/${identifier}`;
        const documentKey = `${documentsPath}/${identifier}`;

        const post: BlogPostContract = {
            key: postKey,
            title: title,
            description: description,
            keywords: keywords,
            permalink: url,
            contentKey: documentKey
        };

        await this.objectStorage.addObject(postKey, post);

        const contentTemplate = await this.blockService.getBlockByKey(templateBlockKey);

        await this.objectStorage.addObject(documentKey, { nodes: [contentTemplate.content] });

        return post;
    }

    public async updateBlogPost(blogPost: BlogPostContract): Promise<void> {
        await this.objectStorage.updateObject<BlogPostContract>(blogPost.key, blogPost);
    }

    public async getBlogPostContent(postKey: string): Promise<Contract> {
        const page = await this.getBlogPostByKey(postKey);
        return await this.objectStorage.getObject(page.contentKey);
    }

    public async updateBlogPostContent(postKey: string, document: Contract): Promise<void> {
        const page = await this.getBlogPostByKey(postKey);
        this.objectStorage.updateObject(page.contentKey, document);
    }
}
