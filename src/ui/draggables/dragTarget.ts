import { DragManager, DragTargetConfig } from "../../ui/draggables";

export class DragTarget {
    private readonly dragManager: DragManager;

    public readonly element: HTMLElement;
    public readonly  config: DragTargetConfig;

    constructor(element: HTMLElement, config: DragTargetConfig, dragManager: DragManager) {
        this.element = element;
        this.config = config;
        this.dragManager = dragManager;

        this.onPointerMove = this.onPointerMove.bind(this);

        element.addEventListener("mousemove", this.onPointerMove, false);
    }

    private onPointerMove(event: MouseEvent): void {
        event.stopPropagation();

        if (!this.dragManager.dragged) {
            return;
        }

        const clientRect = this.element.getBoundingClientRect();
        const scrollY = window.scrollY | document.documentElement.scrollTop;
        const scrollX = window.scrollX | document.documentElement.scrollLeft;

        if (!(event.pageX > (clientRect.left + scrollX) &&
            event.pageX < (clientRect.right + scrollX) &&
            event.pageY > (clientRect.top + scrollY) &&
            event.pageY < (clientRect.bottom + scrollY))) {
            return;
        }

        const readyToAccept = this.config.accept && this.config.accept(this.dragManager.sourceData, this.dragManager.dragged);

        if (readyToAccept) {
            let before: boolean = false;

            if (this.config.flow === "vertical") {
                before = (event.pageY + clientRect.height / 2) < clientRect.bottom;

                if (before && this.config.onacceptbefore) {
                    this.config.onacceptbefore(this.dragManager.dragged, this.element, this.dragManager.sourceData);
                }

                if (!before && this.config.onacceptafter) {
                    this.config.onacceptafter(this.dragManager.dragged, this.element, this.dragManager.sourceData);
                }
            }

            if (this.config.flow === "horizontal") {
                before = (event.pageX + clientRect.width / 2) < clientRect.right;

                if (before && this.config.onacceptbefore) {
                    this.config.onacceptbefore(this.dragManager.dragged, this.element, this.dragManager.sourceData);
                }

                if (!before && this.config.onacceptafter) {
                    this.config.onacceptafter(this.dragManager.dragged, this.element, this.dragManager.sourceData);
                }
            }

            this.dragManager.setAcceptor(this, before);
        }
    }
}