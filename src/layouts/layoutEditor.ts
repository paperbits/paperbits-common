import { ColumnModel } from "./../widgets/models/columnModel";
import { RowModel } from "./../widgets/models/rowModel";
import { PageModel } from "./../widgets/models/pageModel";
import { SectionModel } from "./../widgets/models/sectionModel";
import { IWidgetModel } from "./../editing/IWidgetModel";
import { DataTransferTypes } from '../editing/dataTransferTypes';
import { IEventManager } from '../events/IEventManager';
import { IViewManager } from '../ui/IViewManager';
import { IHighlightConfig } from "../ui/IHighlightConfig";

const timeBeforeStartDragging = 700;

export class LayoutEditor {
    private readonly eventManager: IEventManager;
    private readonly viewManager: IViewManager;

    private selectedWidget: HTMLElement;
    private placeholderElement: HTMLElement;
    private sourceColumnModel: ColumnModel;
    private sourceRowModel: RowModel;
    private sourceSectionModel: SectionModel;

    private targetColumnModel: ColumnModel;

    constructor(viewManager: IViewManager) {
        this.viewManager = viewManager;

        // rebinding...
        this.onKeyDown = this.onKeyDown.bind(this);
        this.deleteSelectedWidget = this.deleteSelectedWidget.bind(this);
        this.onNewWidgetDragStart = this.onNewWidgetDragStart.bind(this);
        this.onWidgetDragStart = this.onWidgetDragStart.bind(this);
        this.onWidgetDragEnd = this.onWidgetDragEnd.bind(this);
        this.onAcceptWidgetBeforeRow = this.onAcceptWidgetBeforeRow.bind(this);
        this.onAcceptWidgetAfterRow = this.onAcceptWidgetAfterRow.bind(this);
        this.onAcceptWidgetAfterColumn = this.onAcceptWidgetAfterColumn.bind(this);
        this.onAcceptWidgetBeforeColumn = this.onAcceptWidgetBeforeColumn.bind(this);
        this.onNullPointerMove = this.onNullPointerMove.bind(this);
        this.applyBindingsToWidget = this.applyBindingsToWidget.bind(this);
        this.selectWidget = this.selectWidget.bind(this);
        this.adjustSizes = this.adjustSizes.bind(this);
        this.canAccept = this.canAccept.bind(this);

        // TODO: Close widgetElement editor when widgetElement deleted.

        document.addEventListener("keydown", this.onKeyDown);
    }

    private createPlaceholder(): void {
        this.placeholderElement = $("<div class=\"placeholder\"></div>")[0];
        this.placeholderElement.onmousemove = this.onNullPointerMove;
    }

    private createRow(): HTMLElement {
        return $("<div class=\"row\"></div>")[0];
    }

    private createColumn(): HTMLElement {
        return $("<div></div>")[0];
    }

    private removeGridClasses(element: HTMLElement): void {
        $(element)
            .removeClass("col-md-12")
            .removeClass("col-md-11")
            .removeClass("col-md-10")
            .removeClass("col-md-9")
            .removeClass("col-md-8")
            .removeClass("col-md-7")
            .removeClass("col-md-6")
            .removeClass("col-md-5")
            .removeClass("col-md-4")
            .removeClass("col-md-3")
            .removeClass("col-md-2")
            .removeClass("col-md-1");
    }

    private deleteSelectedWidget(): void {
        if (!this.selectedWidget || $(this.selectedWidget).find("[contenteditable=true]").length > 0) {
            return;
        }

        let parentRow = this.selectedWidget.parentElement;
        let columnElement = this.selectedWidget.parentElement;
        let sourceColumnModel = columnElement["attachedModel"];

        let rowElement = columnElement.parentElement;
        let sourceRowModel = rowElement["attachedModel"];
        let sourceRowWidgetModel = <IWidgetModel>rowElement["attachedWidgetModel"];

        let sectionElement = rowElement.parentElement.parentElement;
        let sourceSectionModel = sectionElement["attachedModel"];

        let widgetModel = this.selectedWidget["attachedModel"];

        /* 1. Remove from source */
        if (sourceColumnModel) {
            sourceColumnModel.widgets.remove(widgetModel);
        }

        sourceRowWidgetModel.applyChanges();

        this.sourceColumnModel = null;
        this.targetColumnModel = null;
    }

    private relayoutRows(rows: Array<HTMLElement>): void {
        rows.forEach((row: any) => {
            this.relayoutRow(row);
        });
    }

    private relayoutRow(rowElement: HTMLElement): void {
        $(rowElement)
            .children()
            .each((index, columnElement) => {
                let numberOfWidgets = $(columnElement).children().length;

                if (numberOfWidgets === 0) {
                    $(columnElement).remove();
                }
            });

        let numberOfColumns = $(rowElement).children().length;

        if (numberOfColumns === 0) {
            $(rowElement).remove();
            return;
        }

        var columnSize = Math.floor(12 / numberOfColumns);
        var columnClass = "col-md-" + (columnSize).toString();

        $(rowElement).children().each((index, columnElement: HTMLElement) => {
            this.removeGridClasses(columnElement);
            $(columnElement).addClass(columnClass);
        });
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (event.keyCode === 46) {
            this.deleteSelectedWidget();
        }
    }

    private onNullPointerMove(event: PointerEvent): void {
        event.stopPropagation();
    }

    private onWidgetDragStart(payload, widgetElement: HTMLElement): void {
        this.viewManager.foldEverything();
        this.createPlaceholder();

        var width = widgetElement.clientWidth + "px";
        var height = widgetElement.clientHeight + "px";

        this.placeholderElement.style.width = width;
        this.placeholderElement.style.height = height;

        $(widgetElement).after(this.placeholderElement);


        let columnElement = widgetElement.parentElement;
        this.sourceColumnModel = columnElement["attachedModel"];

        let rowElement = columnElement.parentElement;
        this.sourceRowModel = rowElement["attachedModel"];

        let sectionElement = rowElement.parentElement.parentElement;
        this.sourceSectionModel = sectionElement["attachedModel"];
    }

    public onNewWidgetDragStart(widgetElement: HTMLElement, event: any): boolean {
        this.viewManager.foldEverything();
        this.createPlaceholder();

        return true;
    }

    private selectWidget(widgetElement: HTMLElement): void {
        // this.clearSelection();
        // this.selectedWidget = widgetElement;

        // let config: IHighlightConfig = {
        //     element: widgetElement,
        //     color: "red"
        // }

        // this.viewManager.setSelectedElement(config);
    }

    private adjustSizes(widgetElement: HTMLElement): void {
        var placeholderParentColumn = this.placeholderElement.parentElement;
        var placeholderParentRow = placeholderParentColumn.parentElement;

        this.placeholderElement.style.height = placeholderParentRow.clientHeight + "px";
        this.placeholderElement.style.width = placeholderParentColumn.clientWidth + "px";

        widgetElement.style.width = this.placeholderElement.style.width;

        setTimeout(() => {
            if (this.placeholderElement) {
                this.placeholderElement.style.height = widgetElement.clientHeight + "px";
            }

        }, timeBeforeStartDragging);
    }

    private onAcceptWidgetBeforeRow(widgetElement: HTMLElement, rowElement: HTMLElement): void {
        return;

        if (!this.placeholderElement) {
            this.createPlaceholder();
        }

        let placeholderParentColumn = this.placeholderElement.parentElement;
        var placeholderParentRow: HTMLElement;

        if (placeholderParentColumn) {
            placeholderParentRow = placeholderParentColumn.parentElement;

            if (rowElement === placeholderParentRow)
                return;

            let newRow = this.createRow();

            newRow.appendChild(placeholderParentColumn);
            $(rowElement).before(newRow);
            this.applyBindingsToRow(newRow);

            this.relayoutRows([placeholderParentRow, rowElement]);
        }
        else {
            var newColumn = this.createColumn();
            newColumn.appendChild(this.placeholderElement);
            this.applyBindingsToColumn(newColumn);

            let newRow = this.createRow();
            newRow.appendChild(newColumn);
            this.applyBindingsToRow(newRow);

            $(rowElement).before(newRow);

            this.relayoutRows([rowElement, newRow]);
        }

        this.adjustSizes(widgetElement);
    }

    private onAcceptWidgetAfterRow(widgetElement: HTMLElement, rowElement: HTMLElement): void {
        return;

        if (!this.placeholderElement) {
            this.createPlaceholder();
        }

        let placeholderParentColumn = this.placeholderElement.parentElement;
        var placeholderParentRow: HTMLElement;

        if (placeholderParentColumn) {
            placeholderParentRow = placeholderParentColumn.parentElement;

            if (rowElement === placeholderParentRow)
                return;

            let newRow = this.createRow();
            newRow.appendChild(placeholderParentColumn);
            $(rowElement).after(newRow);
            this.applyBindingsToRow(newRow);

            this.relayoutRows([placeholderParentRow, rowElement]);
        }
        else {
            var newColumn = this.createColumn();
            newColumn.appendChild(this.placeholderElement);

            this.applyBindingsToColumn(newColumn);
            let newRow = this.createRow();

            newRow.appendChild(newColumn);
            $(rowElement).after(newRow);
            this.applyBindingsToRow(newRow);

            this.relayoutRows([rowElement, newRow]);
        }

        this.adjustSizes(widgetElement);
    }

    private onAcceptWidgetBeforeColumn(widgetElement: HTMLElement, columnElement: HTMLElement): void {
        if (!this.placeholderElement) {
            this.createPlaceholder();
        }

        var placeholderParentColumn = this.placeholderElement.parentElement;

        if (placeholderParentColumn) {
            var placeholderParentRow = placeholderParentColumn.parentElement;

            if (columnElement.previousSibling === placeholderParentColumn)
                return;

            $(columnElement).before(placeholderParentColumn);

            var columnParentRow = columnElement.parentElement;

            this.relayoutRows([placeholderParentRow, columnParentRow]);
        }
        else {
            placeholderParentColumn = this.createColumn();
            placeholderParentColumn.appendChild(this.placeholderElement);
            this.applyBindingsToColumn(placeholderParentColumn);

            $(columnElement).before(placeholderParentColumn);

            let columnParentRow = columnElement.parentElement;

            this.relayoutRows([columnParentRow]);
        }

        this.adjustSizes(widgetElement);
    }

    private onAcceptWidgetAfterColumn(widgetElement: HTMLElement, acceptingColumnElement: HTMLElement): void {
        if (!this.placeholderElement) {
            this.createPlaceholder();
        }

        var placeholderParentColumn = this.placeholderElement.parentElement;

        if (placeholderParentColumn) {
            var placeholderParentRow = placeholderParentColumn.parentElement;

            if (acceptingColumnElement.nextSibling === placeholderParentColumn)
                return;

            $(acceptingColumnElement).after(placeholderParentColumn);
            let columnParentRow = acceptingColumnElement.parentElement;

            this.relayoutRows([placeholderParentRow, columnParentRow]);
        }
        else {
            placeholderParentColumn = this.createColumn();
            placeholderParentColumn.appendChild(this.placeholderElement);
            this.applyBindingsToColumn(placeholderParentColumn);

            $(acceptingColumnElement).after(placeholderParentColumn);

            let columnParentRow = acceptingColumnElement.parentElement;

            this.relayoutRows([columnParentRow]);
        }

        this.adjustSizes(widgetElement);
    }

    private canAccept(payload, dragged: HTMLElement): boolean {
        return payload === DataTransferTypes.widget || payload["widgetOrder"];
    }

    public applyBindingsToWidget(widgetElement: HTMLElement): void {
        ko.applyBindingsToNode(widgetElement, {
            // dragsource: {
            //     payload: DataTransferTypes.widget,
            //     sticky: true,
            //     ondragstart: this.onWidgetDragStart,
            //     ondragend: this.onWidgetDragEnd,
            //     preventDragging: function () {
            //         let attachedWidgetModel = widgetElement["attachedWidgetModel"];
            //         return attachedWidgetModel.readonly || $(widgetElement).find("[contenteditable=true]").length > 0;
            //     }
            // },
            click: () => {
                let attachedWidgetModel = widgetElement["attachedWidgetModel"];

                if (!attachedWidgetModel || attachedWidgetModel.readonly) {
                    return;
                }

                this.selectWidget(widgetElement);
            }
        });
    }

    public applyBindingsToColumn(columnElement: HTMLElement): void {
        ko.applyBindingsToNode(columnElement, {
            dragtarget: {
                flow: "horizontal",
                accept: this.canAccept,
                onacceptbefore: this.onAcceptWidgetBeforeColumn,
                onacceptafter: this.onAcceptWidgetAfterColumn
            }
        });
    }

    private selectedPage: PageModel;
    private selectedSection: IWidgetModel;
    private selectedRow: IWidgetModel;
    private selectedColumn: IWidgetModel;

    public setActivePage(pageModel: PageModel) {
        this.selectedPage = pageModel;
    }

    public setActiveSection(widget: IWidgetModel) {
        this.selectedSection = widget;
    }

    public setActiveRow(widget: IWidgetModel) {
        this.selectedRow = widget;
    }

    public setActiveColumn(widget: IWidgetModel) {
        this.selectedColumn = widget;
    }

    public addRowToSection(sectionWidgetModel: IWidgetModel) {
        if (this.selectedSection) {
            let sectionModel = <SectionModel>this.selectedSection.model;
            sectionModel.rows.push(new RowModel());
            this.selectedSection.applyChanges();
        }
    }

    public addWidget(widgetModel) {
        if (this.selectedColumn) {
            let rowModel = <ColumnModel>this.selectedColumn.model;
            rowModel.widgets.push(widgetModel);
            this.selectedColumn.applyChanges();
        }
    }

    public applyBindingsToRow(rowElement: HTMLElement): void {
        ko.applyBindingsToNode(rowElement, {
            dragtarget: {
                flow: "vertical",
                accept: this.canAccept,
                onacceptbefore: this.onAcceptWidgetBeforeRow,
                onacceptafter: this.onAcceptWidgetAfterRow
            }
        });
    }

    public onWidgetDragEnd(payload, widgetElement: HTMLElement): void {
        this.viewManager.unfoldEverything();

        if (!this.placeholderElement) {
            $(widgetElement).remove();
            return;
        }

        let placeholderParentColumn = this.placeholderElement.parentElement;

        if (!placeholderParentColumn) {
            this.placeholderElement = null;
            return;
        }

        let placeholderParentRow = placeholderParentColumn.parentElement;

        if (!placeholderParentRow) {
            return;
        }

        if (widgetElement) {
            widgetElement.removeAttribute("style");
            $(this.placeholderElement).after(widgetElement);
        }

        $(this.placeholderElement).remove();
        this.placeholderElement = null;

        let targetColumnElement = placeholderParentColumn;
        let targetRowElement = targetColumnElement.parentElement;
        let targetSectionElement = targetRowElement.parentElement.parentElement;

        let targetRowModel: RowModel = targetRowElement["attachedModel"];
        let targetColumnElementIndex = [].slice.call(targetRowElement.children).indexOf(targetColumnElement);
        let targetRowElementIndex = [].slice.call(targetSectionElement.children).indexOf(targetRowElement);

        let widgetModel = widgetElement["attachedModel"];

        /* 1. Remove from source */
        if (this.sourceColumnModel) {
            let sourceColumnModel = this.sourceColumnModel;
            let sourceRowModel = this.sourceRowModel;
            let sourceSectionModel = this.sourceSectionModel;

            sourceColumnModel.widgets.remove(widgetModel);
            sourceRowModel.columns.remove(sourceColumnModel);

            this.recalculateColumnSizes(sourceRowModel);

            if (sourceRowModel != targetRowModel && sourceRowModel.columns.length === 0) {
                sourceSectionModel.rows.remove(sourceRowModel);
            }
        }

        /* 2. Add to target */
        let targetSectionModel: SectionModel = targetSectionElement["attachedModel"];

        if (!targetRowModel) { // it means it's new row
            targetRowModel = new RowModel();
            targetRowElement["attachedModel"] = targetRowModel;
            targetSectionModel.rows.splice(targetRowElementIndex, 0, targetRowModel);
        }

        let targetColumnModel = new ColumnModel(); // We should not create column each time.

        targetColumnModel.widgets.push(widgetModel);
        targetColumnElement["attachedModel"] = targetColumnModel;

        this.applyBindingsToColumn(targetColumnElement);

        targetRowModel.columns.splice(targetColumnElementIndex, 0, targetColumnModel);

        this.recalculateColumnSizes(targetRowModel);

        this.sourceColumnModel = null;
        this.targetColumnModel = null;

        // this.selectedRow.applyChanges();
    }

    private recalculateColumnSizes(rowModel: RowModel): void {
        let numberOfColumns = rowModel.columns.length;
        var columnSize = Math.floor(12 / numberOfColumns);

        rowModel.columns.forEach(column => {
            column.sizeMd = columnSize;
        });
    }
}