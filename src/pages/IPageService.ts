import { IFile } from '../files/IFile';
import { PageContract } from '../pages/pageContract';

/**
 * Service for managing pages.
 */
export interface IPageService {
    search(pattern: string): Promise<Array<PageContract>>;

    getPageByKey(key: string): Promise<PageContract>;

    deletePage(page: PageContract): Promise<void>;

    createPage(title: string, description: string, keywords): Promise<PageContract>;

    updatePage(page: PageContract): Promise<void>;
}
