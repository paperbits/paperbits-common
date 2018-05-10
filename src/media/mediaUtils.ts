
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
        }

        fileReader.readAsArrayBuffer(file);
    })
}