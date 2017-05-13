import { DragManager } from '../../ui/draggables/dragManager';
import { IDragTargetConfig } from '../../ui/draggables/IDragTargetConfig';

export class DragTarget {
    private dragManager: DragManager;

    public element: HTMLElement;
    public config: IDragTargetConfig;

    constructor(element: HTMLElement, config: IDragTargetConfig, dragManager: DragManager) {
        this.element = element;
        this.config = config;
        this.dragManager = dragManager;

        this.onPointerMove = this.onPointerMove.bind(this);

        element.addEventListener("mousemove", this.onPointerMove, false);
    }

    private onPointerMove(event: PointerEvent) {
        event.stopPropagation();

        if (!this.dragManager.dragged)
            return;

        let clientRect = this.element.getBoundingClientRect();
        let scrollY = window.scrollY | document.documentElement.scrollTop;
        let scrollX = window.scrollX | document.documentElement.scrollLeft;

        if (!(event.pageX > (clientRect.left + scrollX) &&
            event.pageX < (clientRect.right + scrollX) &&
            event.pageY > (clientRect.top + scrollY) &&
            event.pageY < (clientRect.bottom + scrollY))) {
            return;
        }

        let readyToAccept = this.config.accept && this.config.accept(this.dragManager.payload, this.dragManager.dragged);

        if (readyToAccept) {
            let before: boolean = false;

            if (this.config.flow === "vertical") {
                before = (event.pageY + clientRect.height / 2) < clientRect.bottom;

                if (before && this.config.onacceptbefore) {
                    this.config.onacceptbefore(this.dragManager.dragged, this.element, this.dragManager.payload);
                }

                if (!before && this.config.onacceptafter) {
                    this.config.onacceptafter(this.dragManager.dragged, this.element, this.dragManager.payload);
                }
            }

            if (this.config.flow === "horizontal") {
                before = (event.pageX + clientRect.width / 2) < clientRect.right;

                if (before && this.config.onacceptbefore) {
                    this.config.onacceptbefore(this.dragManager.dragged, this.element, this.dragManager.payload);
                }

                if (!before && this.config.onacceptafter) {
                    this.config.onacceptafter(this.dragManager.dragged, this.element, this.dragManager.payload);
                }
            }

            this.dragManager.setAcceptor(this, before);
        }
    }
}