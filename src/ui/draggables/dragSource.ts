import { DragSourceConfig } from "../../ui/draggables/dragSourceConfig";
import { DragManager } from "../../ui/draggables/dragManager";


export class DragSource {
    private dragManager: DragManager;

    public element: HTMLElement;
    public configuration: DragSourceConfig;
    public initialOffsetX: number;
    public initialOffsetY: number;
    public initialPointerX: number;
    public initialPointerY: number;

    constructor(element: HTMLElement, config: DragSourceConfig, dragManager: DragManager) {
        this.element = element;
        this.configuration = config;
        this.dragManager = dragManager;

        this.onPointerDown = this.onPointerDown.bind(this);

        element.addEventListener("mousedown", this.onPointerDown);
    }

    private onPointerDown(event: MouseEvent): void {
        var targetElement = event.target as HTMLElement;


        if (this.configuration.preventDragging && this.configuration.preventDragging(targetElement)) {
            return;
        }
        
        if (event.buttons !== 1 || event["handled"]) {
            return;
        }

        // if (event.pointerType === "touch") {
        //     debugger;
        // }

        event["handled"] = true;

        const rect = this.element.getBoundingClientRect();
        this.initialOffsetX = event.clientX - rect.left;
        this.initialOffsetY = event.clientY - rect.top;
        this.initialPointerX = event.clientX;
        this.initialPointerY = event.clientY;

        this.dragManager.onPointerDown(this);
    }
}