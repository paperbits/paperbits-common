import { EventManager, Events } from "../events";
import { Keys, KeyCodes } from "../keyboard";

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
        this.documents = [];
    }

    public appendDocument(doc: Document): void {
        if (this.documents.indexOf(doc) > -1) {
            return;
        }

        this.documents.push(doc);

        doc.addEventListener(Events.KeyDown, this.onKeyDown, true);
        doc.addEventListener(Events.KeyUp, this.onKeyUp, true);
        doc.addEventListener(Events.DragEnter, this.onDragEnter, true);
        doc.addEventListener(Events.DragStart, this.onDragStart, true);
        doc.addEventListener(Events.DragOver, this.onDragOver, true);
        doc.addEventListener(Events.DragLeave, this.onDragLeave.bind(this));
        doc.addEventListener(Events.Drop, this.onDragDrop, true);
        doc.addEventListener(Events.DragEnd, this.onDragEnd, true);
        doc.addEventListener(Events.Paste, this.onPaste, true);
        doc.addEventListener(Events.MouseMove, this.onPointerMove, true);
        doc.addEventListener(Events.MouseDown, this.onPointerDown, true);
        doc.addEventListener(Events.MouseUp, this.onPointerUp, true);
        doc.defaultView.window.addEventListener(Events.Error, this.onError, true);
        doc.defaultView.window.addEventListener(Events.UnhandledRejection, this.onUnhandledRejection, true);
    }

    public removeDocument(doc: Document): void {
        this.documents.remove(doc);

        doc.removeEventListener(Events.KeyDown, this.onKeyDown, true);
        doc.removeEventListener(Events.KeyUp, this.onKeyUp, true);
        doc.removeEventListener(Events.DragEnter, this.onDragEnter, true);
        doc.removeEventListener(Events.DragStart, this.onDragStart, true);
        doc.removeEventListener(Events.DragOver, this.onDragOver, true);
        doc.removeEventListener(Events.DragLeave, this.onDragLeave.bind(this));
        doc.removeEventListener(Events.Drop, this.onDragDrop, true);
        doc.removeEventListener(Events.DragEnd, this.onDragEnd, true);
        doc.removeEventListener(Events.Paste, this.onPaste, true);
        doc.removeEventListener(Events.MouseMove, this.onPointerMove, true);
        doc.removeEventListener(Events.MouseDown, this.onPointerDown, true);
        doc.removeEventListener(Events.MouseUp, this.onPointerUp, true);
        doc.defaultView.window.removeEventListener(Events.Error, this.onError, true);
        doc.defaultView.window.removeEventListener(Events.UnhandledRejection, this.onUnhandledRejection, true);
    }

    public onKeyDown(event: KeyboardEvent): void {
        this.eventManager.dispatchEvent("onKeyDown", event);

        if (event.ctrlKey && event.code === KeyCodes.S) {
            event.preventDefault();
            this.onCtrlS();
        }

        if (event.ctrlKey && event.code === KeyCodes.O) {
            event.preventDefault();
            this.onCtrlO();
        }

        if (event.ctrlKey && event.code === KeyCodes.P) {
            event.preventDefault();
            this.onCtrlP();
        }

        if (event.key === Keys.Delete) {
            this.onDelete();
        }

        if (event.key === Keys.Escape) {
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
}