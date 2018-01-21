export class BackgroundModel {
    public color?: string;

    // TODO: There should not be mixes of keys and values. There should be BackgroundModel and BackgroundViewModel.
    public colorKey?: string;

    public size?: string;

    public position?: string;

    /**
     * i.e. Picture.
     */
    public sourceType?: string;

    /**
     * Permalink to source, image or video.
     */
    public sourceKey?: string;

    public sourceUrl?: string;

    public repeat?: string;
    

    constructor() {
        this.sourceType = "none";
        this.size = "contain";
        this.position = "center center";
        this.repeat = "no-repeat";
    }
}