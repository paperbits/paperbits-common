import { BackgroundModel } from "@paperbits/common/widgets/background";

export interface BehaviorHandle {
    update?: (newModel: BackgroundModel) => void;
    dispose?: () => void;
}

export class BackgroundBehavior {
    public static attach(element: HTMLElement, model: BackgroundModel): BehaviorHandle {
        const setElementStyle = (currentModel: BackgroundModel) => {
            const style = element.style;

            if (currentModel.sourceUrl) {
                style.backgroundImage = `url("${currentModel.sourceUrl}")`;
                style.backgroundRepeat = "no-repeat";
                style.backgroundSize = "cover";
                style.backgroundPosition = "center";
                style.backgroundColor = currentModel.color || "";
            } else if (currentModel.color) {
                style.backgroundColor = currentModel.color;
                style.backgroundImage = "";
                style.backgroundRepeat = "";
                style.backgroundSize = "";
                style.backgroundPosition = "";
            } else {
                style.backgroundImage = "";
                style.backgroundRepeat = "";
                style.backgroundSize = "";
                style.backgroundPosition = "";
                style.backgroundColor = "";
            }
        };

        setElementStyle(model || {});

        return {
            update: (newModel: BackgroundModel) => {
                setElementStyle(newModel || {});
            },
            dispose: () => {
                element.style.backgroundImage = "";
                element.style.backgroundRepeat = "";
                element.style.backgroundSize = "";
                element.style.backgroundPosition = "";
                element.style.backgroundColor = "";
            }
        };
    }
}
