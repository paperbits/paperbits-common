import { EventManager } from "../events";
import { Keys } from "../keyboard";

export class GlobalEventHandler {
    private readonly documents: Document[];

    constructor(private readonly eventManager: EventManager) {
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onCtrlS = this.onCtrlS.bind(this);
        this.onCtrlO = this.onCtrlO.bind(this);
        this.onEscape = this.onEscape.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onError = this.onError.bind(this);
        this.onUnhandledRejection = this.onUnhandledRejection.bind(this);
        this.addDragStartListener = this.addDragStartListener.bind(this);
        this.addDragEnterListener = this.addDragEnterListener.bind(this);
        this.addDragDropListener = this.addDragDropListener.bind(this);
        this.addDragEndListener = this.addDragEndListener.bind(this);
        this.addDragLeaveListener = this.addDragLeaveListener.bind(this);
        this.addDragLeaveScreenListener = this.addDragLeaveScreenListener.bind(this);
        this.addKeyDownListener = this.addKeyDownListener.bind(this);
        this.addKeyUpListener = this.addKeyUpListener.bind(this);
        this.documents = [];
    }

    public appendDocument(doc: Document): void {
        if (this.documents.indexOf(doc) > -1) {
            return;
        }

        this.documents.push(doc);

        doc.addEventListener("keydown", this.onKeyDown, true);
        doc.addEventListener("keyup", this.onKeyUp, true);
        doc.addEventListener("dragenter", this.onDragEnter, true);
        doc.addEventListener("dragstart", this.onDragStart, true);
        doc.addEventListener("dragover", this.onDragOver, true);
        doc.addEventListener("dragleave", this.onDragLeave.bind(this));
        doc.addEventListener("drop", this.onDragDrop, true);
        doc.addEventListener("dragend", this.onDragEnd, true);
        doc.addEventListener("paste", this.onPaste, true);
        doc.addEventListener("mousemove", this.onPointerMove, true);
        doc.addEventListener("mousedown", this.onPointerDown, true);
        doc.addEventListener("mouseup", this.onPointerUp, true);
        doc.defaultView.window.addEventListener("error", this.onError, true);
        doc.defaultView.window.addEventListener("unhandledrejection", this.onUnhandledRejection, true);
    }

    public removeDocument(doc: Document): void {
        this.documents.remove(doc);

        doc.removeEventListener("keydown", this.onKeyDown, true);
        doc.removeEventListener("keyup", this.onKeyUp, true);
        doc.removeEventListener("dragenter", this.onDragEnter, true);
        doc.removeEventListener("dragstart", this.onDragStart, true);
        doc.removeEventListener("dragover", this.onDragOver, true);
        doc.removeEventListener("dragleave", this.onDragLeave.bind(this));
        doc.removeEventListener("drop", this.onDragDrop, true);
        doc.removeEventListener("dragend", this.onDragEnd, true);
        doc.removeEventListener("paste", this.onPaste, true);
        doc.removeEventListener("mousemove", this.onPointerMove, true);
        doc.removeEventListener("mousedown", this.onPointerDown, true);
        doc.removeEventListener("mouseup", this.onPointerUp, true);
        doc.defaultView.window.removeEventListener("error", this.onError, true);
        doc.defaultView.window.removeEventListener("unhandledrejection", this.onUnhandledRejection, true);
    }

    public onKeyDown(event: KeyboardEvent): void {
        this.eventManager.dispatchEvent("onKeyDown", event);

        if (event.ctrlKey && event.keyCode === Keys.S) {
            event.preventDefault();
            this.onCtrlS();
        }

        if (event.ctrlKey && event.keyCode === Keys.O) {
            event.preventDefault();
            this.onCtrlO();
        }

        if (event.ctrlKey && event.keyCode === Keys.P) {
            event.preventDefault();
            this.onCtrlP();
        }

        if (event.keyCode === Keys.Delete) {
            this.onDelete();
        }

        if (event.keyCode === Keys.Esc) {
            event.preventDefault();
            this.onEscape();
        }
    }

    public onKeyUp(event: KeyboardEvent): void {
        this.eventManager.dispatchEvent("onKeyUp", event);
    }

    private onCtrlS(): void {
        this.eventManager.dispatchEvent("onSaveChanges");
    }

    private onCtrlO(): void {
        this.eventManager.dispatchEvent("onLoadData");
    }

    private onCtrlP(): void {
        this.eventManager.dispatchEvent("onPublish");
    }

    private onEscape(): void {
        this.eventManager.dispatchEvent("onEscape");
    }

    private onDelete(): void {
        this.eventManager.dispatchEvent("onDelete");
    }

    private onPointerMove(event: MouseEvent): void {
        this.eventManager.dispatchEvent("onPointerMove", event);
    }

    private onPointerDown(event: MouseEvent): void {
        this.eventManager.dispatchEvent("onPointerDown", event);
    }

    private onPointerUp(event: MouseEvent): void {
        this.eventManager.dispatchEvent("onPointerUp", event);
    }

    private onDragStart(event: DragEvent): void {
        this.eventManager.dispatchEvent("onDragStart");
    }

    private onDragEnter(event: DragEvent): void {
        // event.dataTransfer.types ARE available here!

        this.eventManager.dispatchEvent("onDragEnter");
        event.preventDefault();
    }

    private onDragOver(event: DragEvent): void {
        event.preventDefault();
        this.eventManager.dispatchEvent("onDragOver");
    }

    private onDragLeave(event: DragEvent): void {
        this.eventManager.dispatchEvent("onDragLeave");

        if (event.screenX === 0 && event.screenY === 0) {
            this.eventManager.dispatchEvent("onDragLeaveScreen");
        }
    }

    private onDragDrop(event: DragEvent): void {
        this.eventManager.dispatchEvent("onDragDrop", event);

        event.preventDefault();
    }

    private onDragEnd(): void {
        this.eventManager.dispatchEvent("onDragEnd");
    }

    private onPaste(event: ClipboardEvent): void {
        this.eventManager.dispatchEvent("onPaste", event);
    }

    private onError(event: ErrorEvent): void {
        this.eventManager.dispatchEvent("onError", event);
    }

    private onUnhandledRejection(event: ErrorEvent): void {
        this.eventManager.dispatchEvent("onUnhandledRejection", event);
    }

    public addDragStartListener(callback: (args?: any) => void): void {
        this.eventManager.addEventListener("onDragStart", callback);
    }

    public addDragEnterListener(callback: (args?: any) => void): void {
        this.eventManager.addEventListener("onDragEnter", callback);
    }

    public addDragOverListener(callback: (args?: any) => void): void {
        this.eventManager.addEventListener("onDragOver", callback);
    }

    public addDragLeaveListener(callback: (args?: any) => void): void {
        this.eventManager.addEventListener("onDragLeave", callback);
    }

    public addDragLeaveScreenListener(callback: (args?: any) => void): void {
        this.eventManager.addEventListener("onDragLeaveScreen", callback);
    }

    public addDragDropListener(callback: (args?: any) => void): void {
        this.eventManager.addEventListener("onDragDrop", callback);
    }

    public addDragEndListener(callback: (args?: any) => void): void {
        this.eventManager.addEventListener("onDragEnd", callback);
    }

    public addPasteListener(callback: (args?: any) => void): void {
        this.eventManager.addEventListener("onPaste", callback);
    }

    public addPointerMoveEventListener(callback: (args?: any) => void): void {
        this.eventManager.addEventListener("onPointerMove", callback);
    }

    public addKeyDownListener(callback: (args?: any) => void): void {
        this.eventManager.addEventListener("onKeyDown", callback);
    }

    public addKeyUpListener(callback: (args?: any) => void): void {
        this.eventManager.addEventListener("onKeyUp", callback);
    }
}