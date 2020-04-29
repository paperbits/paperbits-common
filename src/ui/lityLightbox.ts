import { ILightbox } from '../ui/ILightbox';
import * as basicLightbox from 'basiclightbox'

export class LityLightbox implements ILightbox {

    public videoType: Set<string>;

    show(url: string, fileName: string): void {
        const lightbox = basicLightbox.create(`
            <div class="lightbox-title">${fileName}</div>
            <img class="lightbox-img" src="${url}">
        `)
        lightbox.show()
    }
}