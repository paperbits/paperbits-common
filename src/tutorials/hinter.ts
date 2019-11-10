import { ILayoutService } from "../layouts";
import { Router } from "../routing";
import { ViewManager } from "./../ui";
import { EventManager } from "../events";

export class Hinter {
    private noHints: boolean;

    constructor(
        private readonly eventManager: EventManager,
        private readonly viewManager: ViewManager,
        private readonly router: Router,
        private readonly layoutService: ILayoutService,
    ) {
        this.noHints = false;
        this.eventManager.addEventListener("DesignTimeNavigationHint", this.showDesignTimeNavigationHint.bind(this));
        this.eventManager.addEventListener("InactiveLayoutHint", this.showInactiveLayoutHint.bind(this));
    }

    private showDesignTimeNavigationHint(): void {
        if (this.noHints) {
            return;
        }

        this.noHints = true;
        this.viewManager.notifyInfo("Did you know?", `When you're in the administrative view, you still can navigate any website hyperlinks by holding CTRL or ⌘ key and clicking on it.`);
        setTimeout(() => this.noHints = false, 8000);
    }

    private async showInactiveLayoutHint(): Promise<void> {
        if (this.noHints) {
            return;
        }

        this.noHints = true;

        const url = this.router.getPath();
        const layoutContract = await this.layoutService.getLayoutByPermalink(url);

        this.viewManager.notifyInfo("Did you know?", `This section is a part of "<b>${layoutContract.title}</b>" layout. Would you like to open it for editing?`, [{
            title: "Edit layout",
            iconClass: "paperbits-edit-72",
            action: async () => {
                this.viewManager.setHost({ name: "layout-host", params: { layoutKey: layoutContract.key } });
            }
        }]);

        setTimeout(() => this.noHints = false, 8000);
    }
}