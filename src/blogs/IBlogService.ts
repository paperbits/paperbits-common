import { Contract } from "..";
import { BlogPostContract } from "../blogs/blogPostContract";

/**
 * Service for managing blog posts.
 */
export interface IBlogService {
    search(pattern: string, locale?: string): Promise<BlogPostContract[]>;

    /**
     * Returns blog post by specified key.
     * @param key 
     */
    getBlogPostByKey(key: string, locale?: string): Promise<BlogPostContract>;

    /**
     * Returns blog post by specfied key.
     * @param permalink
     */
    getBlogPostByPermalink(permalink: string, locale?: string): Promise<BlogPostContract>;

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
    createBlogPost(url: string, title: string, description: string, keywords: string, locale?: string): Promise<BlogPostContract>;

    /**
     * Updates a blog post.
     * @param blogPostRef 
     */
    updateBlogPost(blogPostRef: BlogPostContract, locale?: string): Promise<void>;

    /**
     * Returns blog post content by specified key.
     * @param postKey 
     */
    getBlogPostContent(postKey: string, locale?: string): Promise<Contract>;

    /**
     * Updates blog post content.
     * @param postKey 
     * @param document 
     */
    updateBlogPostContent(postKey: string, document: Contract, locale?: string): Promise<void>;
}