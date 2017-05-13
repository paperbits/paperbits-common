import { IFile } from '../files/IFile';
import { IBlogPost } from '../blogs/IBlogPost';

export interface IBlogService {
    search(pattern: string): Promise<Array<IBlogPost>>;

    getBlogPostByKey(key: string): Promise<IBlogPost>;

    deleteBlogPost(blogPostRef: IBlogPost): Promise<void>;

    createBlogPost(title: string, description: string, keywords): Promise<IBlogPost>;

    updateBlogPost(blogPostRef: IBlogPost): Promise<void>;
}
