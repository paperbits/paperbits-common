import { DragManager, DragSourceConfig } from "../../ui/draggables";


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
        element["dragSource"] = this;
    }

    private onPointerDown(event: MouseEvent): void {
        if (event.buttons !== 1 || event["handled"]) {
            return;
        }

        event["handled"] = true;

        const targetElement = event.target as HTMLElement;
        this.beginDrag(targetElement, event.clientX, event.clientY);
    }

    public beginDrag(targetElement: HTMLElement, clientX: number, clientY: number): void {
        if (this.configuration.preventDragging && this.configuration.preventDragging(targetElement)) {
            return;
        }

        const rect = this.element.getBoundingClientRect();
        this.initialOffsetX = clientX - rect.left;
        this.initialOffsetY = clientY - rect.top;
        this.initialPointerX = clientX;
        this.initialPointerY = clientY;

        this.dragManager.onPointerDown(this);
    }
}