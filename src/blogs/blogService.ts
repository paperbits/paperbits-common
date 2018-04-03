import * as Utils from '../utils';
import { IPermalink } from '../permalinks/IPermalink';
import { BlogPostContract } from '../blogs/BlogPostContract';
import { IBlogService } from '../blogs/IBlogService';
import { IObjectStorage } from '../persistence/IObjectStorage';
import * as _ from 'lodash';

const blogPostsPath = "posts";

export class BlogService implements IBlogService {
    private readonly objectStorage: IObjectStorage;

    constructor(objectStorage: IObjectStorage) {
        this.objectStorage = objectStorage;
    }

    private async searchByTags(tags: Array<string>, tagValue: string, startAtSearch: boolean): Promise<Array<BlogPostContract>> {
        return await this.objectStorage.searchObjects<BlogPostContract>(blogPostsPath, tags, tagValue, startAtSearch);
    }

    public async getBlogPostByKey(key: string): Promise<BlogPostContract> {
        return await this.objectStorage.getObject<BlogPostContract>(key);
    }

    public search(pattern: string): Promise<Array<BlogPostContract>> {
        return this.searchByTags(["title"], pattern, true);
    }

    public async deleteBlogPost(blogPost: BlogPostContract): Promise<void> {
        var deleteContentPromise = this.objectStorage.deleteObject(blogPost.contentKey);
        var deletePermalinkPromise = this.objectStorage.deleteObject(blogPost.permalinkKey);
        var deleteBlogPostPromise = this.objectStorage.deleteObject(blogPost.key);

        await Promise.all([deleteContentPromise, deletePermalinkPromise, deleteBlogPostPromise]);
    }

    public async createBlogPost(title: string, description: string, keywords): Promise<BlogPostContract> {
        var blogPostId = `${blogPostsPath}/${Utils.guid()}`;

        var blogPost: BlogPostContract = {
            key: blogPostId,
            title: title,
            description: description,
            keywords: keywords,
        };

        await this.objectStorage.addObject(blogPostId, blogPost);

        return blogPost;
    }

    public async updateBlogPost(blogPost: BlogPostContract): Promise<void> {
        await this.objectStorage.updateObject<BlogPostContract>(blogPost.key, blogPost);
    }
}
