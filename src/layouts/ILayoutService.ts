import { LayoutContract } from "./layoutContract";
import { Contract } from "..";
import { Page, Query } from "../persistence";

export interface ILayoutService {
    /**
     * Searches for layouts that contain specified pattern in their title or description.
     * @param query {Query<LayoutContract>} Search query.
     */
    search(query: Query<LayoutContract>, locale?: string): Promise<Page<LayoutContract>>;

    /**
     * Returns layout by specified key.
     * @param key {string} Unique layout identifier.
     */
    getLayoutByKey(key: string, locale?: string): Promise<LayoutContract>;

    /**
     * Returns layout by specified permalink template.
     * @param permalinkTemplate {string} Permalink template, e.g. /blog/{blogId}.
     */
    getLayoutByPermalinkTemplate(permalinkTemplate: string, locale?: string): Promise<LayoutContract>;

    /**
     * Deletes specified layout from store.
     * @param layout {LayoutContract} Contract describing layout metadata.
     */
    deleteLayout(layout: LayoutContract, locale?: string): Promise<void>;

    /**
     * Creates a new layout in store and returns its contract.
     * @param title {string} Layout title, e.g. Blog.
     * @param description {string} Layout description.
     * @param permalinkTemplate {string} Layout permalink template, e.g. /blog/{blogId}.
     */
    createLayout(title: string, description: string, permalinkTemplate: string): Promise<LayoutContract>;

    /**
     * Updates layout.
     * @param layout {LayoutContract} Contract describing layout metadata.
     */
    updateLayout(layout: LayoutContract, locale?: string): Promise<void>;

    /**
     * Returns layout with permalink template matching specified permalink.
     * @param permalink {string} Content item permalink, e.g. /about.
     */
    getLayoutByPermalink(permalink: string, locale?: string): Promise<LayoutContract>;

    /**
     * Returns layout content by specified key.
     * @param key {string} Unique layout identifier.
     */
    getLayoutContent(key: string, locale?: string): Promise<Contract>;

    /**
     * Updates layout content.
     * @param key {string} Unique layout identifier.
     * @param document {Contract} Contract describing content of the layout.
     */
    updateLayoutContent(key: string, document: Contract, locale?: string): Promise<void>;
}
