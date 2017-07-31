export class BackgroundModel {
    public colorKey: string;

    public size: string;

    public position: string;

    /**
     * i.e. Picture.
     */
    public sourceType: string;

    /**
     * Permalink to source, image or video.
     */
    public sourceKey: string;

    public sourceUrl: string;

    public repeat: string;
    

    constructor() {
        this.sourceType = "none";
        this.size = "cover";
        this.position = "center center";
        this.repeat = "no-repeat";
    }
}