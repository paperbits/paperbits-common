import * as $ from "jquery";
import { IDragSourceConfig } from "../../ui/draggables/IDragSourceConfig";
import { DragManager } from "../../ui/draggables/dragManager";


export class DragSource {
    private dragManager: DragManager;

    public element: HTMLElement;
    public configuration: IDragSourceConfig;
    public percentageOffsetX: number;
    public percentageOffsetY: number;

    constructor(element: HTMLElement, config: IDragSourceConfig, dragManager: DragManager) {
        this.element = element;
        this.configuration = config;
        this.dragManager = dragManager;

        this.onPointerDown = this.onPointerDown.bind(this);

        element.addEventListener("mousedown", this.onPointerDown);
    }

    private onPointerDown(event: PointerEvent): void {
        var targetElement = event.target as HTMLElement;

        if (this.configuration.preventDragging && this.configuration.preventDragging(targetElement)) {
            return;
        }

        if (event.buttons !== 1 || event["handled"]) {
            return;
        }

        event["handled"] = true;

        const offsetX = event.pageX - $(this.element).offset().left;
        const offsetY = event.pageY - $(this.element).offset().top;

        this.percentageOffsetX = offsetX / this.element.clientWidth * 100;
        this.percentageOffsetY = offsetY / this.element.clientHeight * 100;

        this.dragManager.onPointerDown(this);
    }
}