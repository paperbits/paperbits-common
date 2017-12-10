import { IMedia } from '../media/IMedia';
import { ISettings } from '../sites/ISettings';

export interface ISiteService {
    setSiteSettings(settings: ISettings): Promise<void>;
    getSiteSettings(): Promise<ISettings>;
}