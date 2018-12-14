import { Contract } from "..";
import { BlogPostContract } from "../blogs/BlogPostContract";

/**
 * Service for managing blog posts.
 */
export interface IBlogService {
    search(pattern: string): Promise<BlogPostContract[]>;

    /**
     * Returns blog post by specified key;
     * @param key 
     */
    getBlogPostByKey(key: string): Promise<BlogPostContract>;

    getBlogPostByUrl(url: string): Promise<BlogPostContract>;

    /**
     * Deletes specified blog post.
     * @param blogPostRef 
     */
    deleteBlogPost(blogPostRef: BlogPostContract): Promise<void>;

    /**
     * Creates a new blog post in storage and returns its contract.
     * @param title 
     * @param description 
     * @param keywords 
     */
    createBlogPost(url: string, title: string, description: string, keywords): Promise<BlogPostContract>;

    /**
     * Updates a blog post.
     * @param blogPostRef 
     */
    updateBlogPost(blogPostRef: BlogPostContract): Promise<void>;

    /**
     * Returns blog post content by specified key.
     * @param postKey 
     */
    getBlogPostContent(postKey: string): Promise<Contract>;

    /**
     * Updates blog post content.
     * @param postKey 
     * @param document 
     */
    updateBlogPostContent(postKey: string, document: Contract): Promise<void>;
}