export interface IHyperlink {
    /**
     * 
     */
    permalinkKey?: string;

    /**
     * Technically, we should always use only permalinks, even for external URLs;
     */
    href?: string;

    /**
     * 
     */
    target: string;
}