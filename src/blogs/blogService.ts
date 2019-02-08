import * as _ from "lodash";
import * as Utils from "../utils";
import { Bag } from "./../bag";
import { BlogPostContract } from "../blogs/blogPostContract";
import { IBlogService } from "../blogs/IBlogService";
import { IObjectStorage } from "../persistence/IObjectStorage";
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

    private async searchByProperties(properties: string[], value: string): Promise<BlogPostContract[]> {
        const result = await this.objectStorage.searchObjects<Bag<BlogPostContract>>(blogPostsPath, properties, value);
        return Object.keys(result).map(key => result[key]);
    }

    public async getBlogPostByPermalink(permalink: string): Promise<BlogPostContract> {
        const result = await this.objectStorage.searchObjects<Bag<BlogPostContract>>(blogPostsPath, ["permalink"], permalink);
        const posts = Object.keys(result).map(key => result[key]);
        return posts.length > 0 ? posts[0] : null;
    }

    public async getBlogPostByKey(key: string): Promise<BlogPostContract> {
        return await this.objectStorage.getObject<BlogPostContract>(key);
    }

    public search(pattern: string): Promise<BlogPostContract[]> {
        return this.searchByProperties(["title"], pattern);
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
