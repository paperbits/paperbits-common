import * as mime from "mime";
import { MediaContract, MediaVariantContract } from "./";


export async function getVideoThumbnailAsDataUrlFromUrl(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const video = document.createElement("video");

        video.crossOrigin = "Anonymous";

        const timeupdate = (): void => {
            if (snapImage()) {
                video.removeEventListener("timeupdate", timeupdate);
                video.pause();
            }
        };

        video.addEventListener("loadeddata", (): void => {
            if (snapImage()) {
                video.removeEventListener("timeupdate", timeupdate);
            }
        });

        const snapImage = (): boolean => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

            const image = canvas.toDataURL();
            const success = image.length > 100000;

            resolve(image);

            if (success) {
                URL.revokeObjectURL(url);
            }
            return success;
        }

        video.addEventListener("timeupdate", timeupdate);
        video.preload = "metadata";
        video.src = url;

        // Load video in Safari / IE11
        video.muted = true;
        //video.playsInline = true;
        video.play();
    });
}

export async function getVideoThumbnailAsDataUrl(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onload = async () => {
            const blob = new Blob([fileReader.result], { type: file.type });
            const url = URL.createObjectURL(blob);
            const dataUrl = await getVideoThumbnailAsDataUrlFromUrl(url);

            resolve(dataUrl);

            URL.revokeObjectURL(url);
        };

        fileReader.readAsArrayBuffer(file);
    });
}

export function getPermalinkForMediaVariant(originalPermalink: string, variant: MediaVariantContract): string {
    const type = mime.getType(originalPermalink) || "";
    let extension = "";

    if (type) {
        extension = `.${mime.getExtension(type)}`;
        originalPermalink = originalPermalink.substr(0, originalPermalink.lastIndexOf("."));
    }

    if (variant.mimeType) { // if variant has its own mime type, assign new extension
        extension = `.${mime.getExtension(variant.mimeType)}`;
    }

    return `${originalPermalink}@${variant.width}x${variant.height}${extension}`;
}

export function getSmallestMediaVariant(mediaContract: MediaContract): MediaVariantContract {
    if (!mediaContract.variants) {
        return null;
    }

    const reducer = (smallest: MediaVariantContract, current: MediaVariantContract) => smallest.width <= current.width ? smallest : current;
    const smallestMediaVariant = mediaContract.variants.reduce(reducer);

    return smallestMediaVariant;
}

export function getBiggestMediaVariant(mediaContract: MediaContract): MediaVariantContract {
    if (!mediaContract.variants) {
        return null;
    }

    const reducer = (biggest: MediaVariantContract, current: MediaVariantContract) => biggest.width > current.width ? biggest : current;
    const biggetsMediaVariant = mediaContract.variants.reduce(reducer);

    return biggetsMediaVariant;
}

export function getThumbnailUrl(mediaContract: MediaContract): string {
    if (!mediaContract.variants) {
        return mediaContract.downloadUrl;
    }

    const reducer = (smallest: MediaVariantContract, current: MediaVariantContract) => smallest.width <= current.width ? smallest : current;
    const smallestMediaVariant = mediaContract.variants.reduce(reducer);

    return smallestMediaVariant.downloadUrl;
}