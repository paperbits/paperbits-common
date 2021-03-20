import { StyleRule } from "./styleRule";

export class StyleAnimation {
    public name: string;
    public frames: StyleAnimationFrame[];
}

export class StyleAnimationFrame {
    public step: number;
    public rules: StyleRule[];
}