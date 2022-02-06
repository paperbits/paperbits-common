import { Contract } from "..";
import { HyperlinkContract } from "../editing/hyperlinkContract";
import { HyperlinkModel } from "./hyperlinkModel";
import { ContentItemContract } from "../contentModel";

export interface IPermalinkResolver {
    /**
     * Verifies if the specified content item can be handled by this resolver.
     * @param targetKey {string} Key of target content item, e.g. `pages/about`.
     */
    canHandleTarget(targetKey: string): boolean;

    /**
     * Returns URL resolved from specified content item.
     * @param targetKey {string} Key of target content item, e.g. `pages/about`.
     * @param locale {string} Locale, e.g. `en-us`.
     */
    getUrlByTargetKey(targetKey: string, locale?: string): Promise<string>;

    /**
     * Converts hyperlink contract into hyperlink model.
     * @param hyperlink {HyperlinkContract} Hyperlink contract.
     * @param locale {string} Locale, e.g. `en-us`.
     */
    getHyperlinkFromContract?(hyperlink: HyperlinkContract, locale?: string): Promise<HyperlinkModel>;

    /**
     * Returns hyperlink model resolved by target content item key.
     * @param targetKey {string} Key of target content item, e.g. `pages/about`.
     * @param locale {string} Locale, e.g. `en-us`.
     */
    getHyperlinkByTargetKey?(targetKey: string, locale?: string): Promise<HyperlinkModel>;

    /**
     * Returns content resolved by permalink.
     * @param permalink {string} Permalink, e.g. `/about`.
     * @param locale {string} Locale, e.g. `en-us`.
     */
    getContentByPermalink?(permalink: string, locale?: string): Promise<Contract>;

    /**
     * Returns content item resolved by permalink.
     * @param permalink {string} Permalink, e.g. `/about`.
     * @param locale {string} Locale, e.g. `en-us`.
     */
    getContentItemByPermalink?(permalink: string, locale?: string): Promise<ContentItemContract>;
}