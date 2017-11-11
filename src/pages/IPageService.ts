import { IFile } from '../files/IFile';
import { IPage } from '../pages/IPage';

/**
 * Service for managing pages.
 */
export interface IPageService {
    search(pattern: string): Promise<Array<IPage>>;

    getPageByKey(key: string): Promise<IPage>;

    deletePage(page: IPage): Promise<void>;

    createPage(title: string, description: string, keywords): Promise<IPage>;

    updatePage(page: IPage): Promise<void>;
}
