import { Toast } from "./toast";
import { ViewManager } from "./viewManager";

export class ToastError extends Error {
    constructor(
        public readonly title: string,
        public readonly message: string,
        public showDiscard: boolean = false,
        public showTime: number = -1,
    ) {
        super(message);
        Object.setPrototypeOf(this, ToastError.prototype);
    }

    showError(viewManager: ViewManager): void {
        let toast: Toast;
        if (this.showDiscard) {
            toast = viewManager.addToast(this.title, this.message, [
                {
                    title: "Discard",
                    iconClass: "paperbits-simple-remove",
                    action: async (): Promise<void> => {
                        viewManager.removeToast(toast);
                    }
                }
            ]);
        } else {
            toast = viewManager.notifyError(this.title, this.message);
        }
        
        if (toast && this.showTime > 0) {
            setTimeout(() => {
                viewManager.removeToast(toast)
            }, this.showTime);
        }
    }
}