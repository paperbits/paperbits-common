import { IPermalink } from "./../permalinks/IPermalink";

/**
 * Provider that helps to create a hyperlink out of a resource.
 */
export interface IHyperlinkProvider {
    /**
     * Display name of the provider, e.g. Pages.
     */
    name: string;

    /**
     * Name of the component that is used for hyperlink selection.
     */
    componentName: string;

    /**
     * Determines if this provider is suitable for a resource the permalink points to.
     */
    canHandleHyperlink?(permalink: IPermalink): boolean;

    /**
     * Creates hyperlink from specified resource, i.e. Page or Media.
     */
    getHyperlinkFromResource(resource: any);
}