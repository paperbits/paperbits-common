import * as Utils from '../core/utils';
import { IPermalink } from '../permalinks/IPermalink';
import { IBlogPost } from '../blogs/IBlogPost';
import { IBlogService } from '../blogs/IBlogService';
import { IFile } from '../files/IFile';
import { IObjectStorage } from '../persistence/IObjectStorage';
import * as _ from 'lodash';

const blogPostsPath = "posts";

export class BlogService implements IBlogService {
    private readonly objectStorage: IObjectStorage;

    constructor(objectStorage: IObjectStorage) {
        this.objectStorage = objectStorage;
    }

    private async searchByTags(tags: Array<string>, tagValue: string, startAtSearch: boolean): Promise<Array<IBlogPost>> {
        return await this.objectStorage.searchObjects<IBlogPost>(blogPostsPath, tags, tagValue, startAtSearch);
    }

    public async getBlogPostByKey(key: string): Promise<IBlogPost> {
        return await this.objectStorage.getObject<IBlogPost>(key);
    }

    public search(pattern: string): Promise<Array<IBlogPost>> {
        return this.searchByTags(["title"], pattern, true);
    }

    public async deleteBlogPost(blogPost: IBlogPost): Promise<void> {
        var deleteContentPromise = this.objectStorage.deleteObject(blogPost.contentKey);
        var deletePermalinkPromise = this.objectStorage.deleteObject(blogPost.permalinkKey);
        var deleteBlogPostPromise = this.objectStorage.deleteObject(blogPost.key);

        await Promise.all([deleteContentPromise, deletePermalinkPromise, deleteBlogPostPromise]);
    }

    public async createBlogPost(title: string, description: string, keywords): Promise<IBlogPost> {
        var blogPostId = `${blogPostsPath}/${Utils.guid()}`;

        var blogPost: IBlogPost = {
            key: blogPostId,
            title: title,
            description: description,
            keywords: keywords,
        };

        await this.objectStorage.addObject(blogPostId, blogPost);

        return blogPost;
    }

    public async updateBlogPost(blogPost: IBlogPost): Promise<void> {
        await this.objectStorage.updateObject<IBlogPost>(blogPost.key, blogPost);
    }
}
