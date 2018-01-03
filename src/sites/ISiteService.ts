import { MediaContract } from '../media/mediaContract';
import { ISettings } from '../sites/ISettings';

export interface ISiteService {
    setSiteSettings(settings: ISettings): Promise<void>;
    getSiteSettings(): Promise<ISettings>;
}