import { RowModel } from "./rowModel";
import { BackgroundModel } from "./backgroundModel";


export class SlideModel {
    public rows: RowModel[];
    public layout: string;
    public padding: string;
    public background: BackgroundModel;
}

export class SliderModel {
    public slides: SlideModel[];
    public activeSlideNumber: number = 0;

    public previousSlide(): void {
        this.activeSlideNumber--;

        if (this.activeSlideNumber < 0) {
            this.activeSlideNumber = this.slides.length - 1;
        }
    }

    public nextSlide(): void {
        this.activeSlideNumber++;

        if (this.activeSlideNumber >= this.slides.length) {
            this.activeSlideNumber = 0;
        }
    }
}