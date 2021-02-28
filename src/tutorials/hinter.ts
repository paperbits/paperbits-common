import { ILayoutService } from "../layouts";
import { Router } from "../routing";
import { ViewManager } from "./../ui";
import { EventManager } from "../events";
import { ISettingsProvider } from "../configuration";

export class Hinter {
    private noHints: boolean;

    constructor(
        private readonly eventManager: EventManager,
        private readonly viewManager: ViewManager,
        private readonly router: Router,
        private readonly layoutService: ILayoutService,
        private readonly localSettings: ISettingsProvider
    ) {
        this.noHints = false;
        this.eventManager.addEventListener("DesignTimeNavigationHint", this.showDesignTimeNavigationHint.bind(this));
        this.eventManager.addEventListener("InactiveLayoutHint", this.showInactiveLayoutHint.bind(this));
    }

    private async showDesignTimeNavigationHint(): Promise<void> {
        const dismissed = await this.localSettings.getSetting("hints:DesignTimeNavigationHint");

        if (dismissed) {
            return;
        }

        const toast = this.viewManager.addToast("Did you know?", `When you're in the administrative view, you still can navigate any website hyperlink by clicking on it holding Ctrl (Windows) or ⌘ (Mac) key.`, [{
            title: "Got it",
            action: async () => {
                await this.localSettings.setSetting("hints:DesignTimeNavigationHint", true);
                this.viewManager.removeToast(toast);
            }
        }]);
    }

    private async showInactiveLayoutHint(): Promise<void> {
        if (this.noHints) {
            return;
        }

        this.noHints = true;

        const url = this.router.getPath();
        const layoutContract = await this.layoutService.getLayoutByPermalink(url);

        const toast = this.viewManager.notifyInfo("Did you know?", `This section is a part of "<b>${layoutContract.title}</b>" layout. Would you like to open it for editing?`, [{
            title: "Edit layout",
            iconClass: "paperbits-edit-72",
            action: async () => {
                this.viewManager.setHost({ name: "layout-host", params: { layoutKey: layoutContract.key } });
                this.viewManager.removeToast(toast);
            }
        }]);

        setTimeout(() => this.noHints = false, 8000);
    }
}