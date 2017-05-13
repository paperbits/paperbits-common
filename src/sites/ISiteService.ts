import { IMedia } from '../media/IMedia';
import { ISiteSettings } from '../sites/ISiteSettings';

export interface ISiteService {
    setSiteSettings(settings: ISiteSettings): Promise<void>;
    getSiteSettings(): Promise<ISiteSettings>;
}