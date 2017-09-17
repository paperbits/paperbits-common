import { IPermalink } from '../permalinks/IPermalink';

export interface IPermalinkService {
    isPermalinkKey(uri: string): boolean;
    isPermalinkExists(permalink: string): Promise<boolean>;
    createPermalink(uri: string, targetLocation: string, parentKey?: string): Promise<IPermalink>;
    getPermalink(permalink: string): Promise<IPermalink>;
    getPermalinkByKey(permalinkKey: string): Promise<IPermalink>;
    getPermalinkByUrl(uri: string): Promise<IPermalink>;
    updatePermalink(permalink: IPermalink): Promise<void>;
    deletePermalink(permalink: IPermalink): Promise<void>;
    deletePermalinkByKey(permalinkKey: string): Promise<void>;
}