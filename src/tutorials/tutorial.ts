import { TutorialStep } from "../tutorials/tutorialStep";

export class Tutorial {
    private currentStepNum = 0;
    private tutorialSteps: TutorialStep[];
    private arrowElement: HTMLElement;
    private timestamp: number;
    private replacingArrow: boolean;

    constructor() {
        this.tutorialSteps = new Array<TutorialStep>();
        this.runCurrentStep = this.runCurrentStep.bind(this);
        this.completeStep = this.completeStep.bind(this);
        this.replaceArrow = this.replaceArrow.bind(this);
        this.onDocumentChange = this.onDocumentChange.bind(this);

        this.timestamp = new Date().getTime();
    }

    private completeStep(): void {
        let currentStep = this.tutorialSteps[this.currentStepNum];
        let currentStepText = currentStep.arrowText;

        let elapsedTime = this.timestamp - (this.timestamp = new Date().getTime());

        // dataLayer.push({
        //     "event": "Tutorial",
        //     "category": "Tutorial",
        //     "action": "StepComplete",
        //     "label": currentStepText,
        //     "value": elapsedTime
        // });

        this.arrowElement.parentElement.remove();
        this.arrowElement = null;
        this.currentStepNum += 1;

        if (this.currentStepNum < this.tutorialSteps.length) {
            setTimeout(this.runCurrentStep, currentStep.stepCompleteDelay);
        }
    }

    private getPageOffsetFor(element: HTMLElement) {
        let top = 0, left = 0;

        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = <HTMLElement>element.offsetParent;
        }
        while (element);

        return {
            top: top,
            left: left
        };
    };

    private replaceArrow(): void {
        if (!this.arrowElement) {
            return;
        }

        let step = this.tutorialSteps[this.currentStepNum];
        let targetElement: HTMLElement;
        let trackedElement: HTMLElement;

        if (step.targetElementSearch) {
            targetElement = step.targetElementSearch();
        }

        if (step.trackedElementSearch) {
            trackedElement = step.trackedElementSearch();
        }

        if (targetElement === undefined || targetElement === null) {
            return;
        }

        if (!trackedElement) {
            trackedElement = targetElement;
        }

        if (targetElement === document.body) {
            this.arrowElement.classList.add("arrow-bottom");
            this.arrowElement.classList.add("arrow-left");
            this.arrowElement.style.bottom = "30px";
            this.arrowElement.style.left = "50px";
            return;
        }

        let arrowRect = this.arrowElement.getBoundingClientRect();
        let targetRect = targetElement.getBoundingClientRect();
        let targetOffset = this.getPageOffsetFor(targetElement);
        let arrowX: number = targetOffset.left + (targetRect.width / 2);
        let arrowY: number = targetOffset.top + (targetRect.height / 2);

        if (step.arrowPosition.includes("left")) {
            this.arrowElement.classList.add("arrow-left");
            arrowX = targetOffset.left - this.arrowElement.clientWidth;
        }

        if (step.arrowPosition.includes("right")) {
            this.arrowElement.classList.add("arrow-right");
            arrowX = targetOffset.left + targetRect.width;
        }

        if (step.arrowPosition.includes("top")) {
            this.arrowElement.classList.add("arrow-top");
            arrowY = targetOffset.top - this.arrowElement.clientHeight + 70 + (targetRect.height / 2);
        }

        if (step.arrowPosition.includes("bottom")) {
            this.arrowElement.classList.add("arrow-bottom");
            arrowY = targetOffset.top + targetRect.height;
        }

        this.arrowElement.style.top = arrowY + "px";
        this.arrowElement.style.left = arrowX + "px";
    }

    private scrollToTarget(trackedElement: HTMLElement): void {
        let step = this.tutorialSteps[this.currentStepNum];

        // (<any>$(trackedElement)).scrollintoview({
        //     duration: 500,
        //     direction: "vertical",
        //     complete: function () {
        //         (<any>$(this.arrowElement)).scrollintoview({
        //             duration: 500,
        //             direction: "vertical"
        //         });
        //     }
        // });
    }

    private findElement(searchFunction: () => HTMLElement): Promise<HTMLElement> {
        let promise = new Promise<HTMLElement>((resolve) => {
            let observer: MutationObserver;
            let onDomChanged = (): void => {
                let htmlElement = searchFunction();
                observer.disconnect();
                resolve(htmlElement);
            }

            observer = new MutationObserver(onDomChanged);
            observer.observe(document, { childList: true, subtree: true, attributes: true });
        });

        return promise;
    }

    private runCurrentStep(): void {
        let step = this.tutorialSteps[this.currentStepNum];

        //TODO: Make search and following instructions async

        let targetElement: HTMLElement;
        let trackedElement: HTMLElement;

        if (step.targetElementSearch) {
            targetElement = step.targetElementSearch();
        }

        if (step.trackedElementSearch) {
            trackedElement = step.trackedElementSearch();
        }

        if (!trackedElement) {
            trackedElement = targetElement;
        }

        // this.arrowElement = $(`<div class="arrow"><span class="step-number">${this.currentStepNum + 1}</span>${step.arrowText}</div>`)[0];

        if (step.targetElementFixed) {
            this.arrowElement.classList.add("arrow-fixed");
        }

        document.body.appendChild(this.arrowElement);

        this.replaceArrow();

        if (!step.targetElementFixed) {
            this.scrollToTarget(trackedElement);
        }

        let mutationObserverCallback = function (mutations) {
            if (step.isComplete(trackedElement)) {
                trackedElementObserver.disconnect();
                this.completeStep();
            }
        };

        switch (step.targetEvent) {
            case "domchange":
                let trackedElementObserver = new MutationObserver(mutationObserverCallback.bind(this));
                trackedElementObserver.observe(trackedElement, { attributes: true, childList: true, characterData: true, subtree: true });
                break;

            case "click": {
                let clickHandler = () => {
                    if (step.isComplete(trackedElement)) {
                        trackedElement.removeEventListener("click", clickHandler);
                        this.completeStep();
                    }
                };
                trackedElement.addEventListener("click", clickHandler);
                break;
            }

            case "dblclick":
                let dblclickHandler = () => {
                    if (step.isComplete(trackedElement)) {
                        trackedElement.removeEventListener("dblclick", dblclickHandler);
                        this.completeStep();
                    }
                };
                trackedElement.addEventListener("dblclick", dblclickHandler);
                break;

            case "mousedown":
                let pointerdownHandler = () => {
                    if (step.isComplete(trackedElement)) {
                        trackedElement.removeEventListener("mousedown", pointerdownHandler);
                        this.completeStep();
                    }
                };
                trackedElement.addEventListener("mousedown", pointerdownHandler);
                break;
        }
    }

    private onDocumentChange(): void {
        if (this.replacingArrow === true) {
            return;
        }

        this.replacingArrow = true;
        this.replaceArrow();
        this.replacingArrow = false;
    }

    public addStep(step: TutorialStep): void {
        this.tutorialSteps.push(step);
    }

    public runScenario(): void {
        let documentObserver = new MutationObserver(this.onDocumentChange);
        documentObserver.observe(document.body, { childList: true, subtree: true, attributes: true });

        this.runCurrentStep();
    }
}