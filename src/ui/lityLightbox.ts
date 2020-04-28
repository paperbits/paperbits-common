import { ILightbox } from '../ui/ILightbox';
import * as basicLightbox from 'basiclightbox'

export class LityLightbox implements ILightbox {

    public videoType: Set<string>;

    constructor() {
        this.videoType = new Set(["mpeg", "mp4", "quicktime", "x-ms-wmv", "x-msvideo", "x-flv", "webm"])
    }

    show(url: string, fileName: string): void {
        let lightbox;
        
        let splitFileName = fileName.split(".");
        const fileType = splitFileName[splitFileName.length - 1]

        // if ( this.videoType.has(fileType) ) {
        //     lightbox = basicLightbox.create(`
        //         <div class="lightbox-title">${fileName}</div>
        //         <video src="${url}" controls>
        //         </video>
        //     `)
        // } else {
            lightbox = basicLightbox.create(`
                <div class="lightbox-title">${fileName}</div>
                <img class="lightbox-img" src="${url}">
            `)
        // }
        lightbox.show()
    }
}