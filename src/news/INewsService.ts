import { IFile } from '../files/IFile';
import { INewsArticle } from '../news/INewsElement';

export interface INewsService {
    search(pattern: string): Promise<Array<INewsArticle>>;

    getNewsElementByKey(key: string): Promise<INewsArticle>;

    deleteNewsElement(newsElementRef: INewsArticle): Promise<void>;

    createNewsElement(title: string, description: string, keywords): Promise<INewsArticle>;

    updateNewsElement(newsElementRef: INewsArticle): Promise<void>;
}
