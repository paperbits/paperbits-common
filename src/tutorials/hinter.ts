import { ILayoutService } from "../layouts";
import { Router } from "../routing";
import { ViewManager } from "./../ui";
import { EventManager } from "../events";
import { ISettingsProvider } from "../configuration";
import { Hint } from "./hint";

export class Hinter {
    private noHints: boolean;
    private activeHintKey: string;

    constructor(
        private readonly eventManager: EventManager,
        private readonly viewManager: ViewManager,
        private readonly router: Router,
        private readonly layoutService: ILayoutService,
        private readonly localSettings: ISettingsProvider
    ) {
        this.noHints = false;
        this.eventManager.addEventListener("displayInactiveLayoutHint", this.showInactiveLayoutHint.bind(this));
        this.eventManager.addEventListener("displayHint", this.displayHint.bind(this));
    }

    private async displayHint(hint: Hint): Promise<void> {
        const hintSettingName = `hints:${hint.key}`;
        const dismissed = await this.localSettings.getSetting(hintSettingName);

        if (!!dismissed || !!this.activeHintKey) {
            return;
        }

        this.activeHintKey = hint.key;

        const toast = this.viewManager.addToast("Did you know?", hint.content, [{
            title: "Got it",
            action: async () => {
                await this.localSettings.setSetting(hintSettingName, true);
                this.viewManager.removeToast(toast);
                this.activeHintKey = null;
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

        const toast = this.viewManager.notifyInfo("Layouts", `This section is a part of "<b>${layoutContract.title}</b>" layout. Would you like to open it for editing?`,
            [{
                title: "Edit layout",
                iconClass: "paperbits-icon paperbits-edit-72",
                action: async () => {
                    this.viewManager.setHost({ name: "layout-host", params: { layoutKey: layoutContract.key } }, true);
                    this.viewManager.removeToast(toast);
                }
            },
            {
                title: "Dismiss",
                action: async () => {
                    this.viewManager.removeToast(toast);
                }
            }]);

        setTimeout(() => this.noHints = false, 8000);
    }
}