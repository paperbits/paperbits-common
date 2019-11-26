import { UserService } from "./userService";
import { EventManager } from "../events";
import * as ko from "knockout";
import * as Utils from "../utils";

/**
 * Guard that adjusts widget visibility depending of user role.
 */
export class VisibilityGuard {
    constructor(
        private readonly userService: UserService,
        private readonly eventManager: EventManager
    ) {
        this.setVisibility();
        this.eventManager.addEventListener("onUserRoleChange", this.setVisibility);
    }

    private async setVisibility(): Promise<void> {
        const userRoles = await this.userService.getUserRoles();

        document.querySelectorAll("[data-role]").forEach((element: HTMLElement) => {
            const requiredRolesAttribute = element.getAttribute("data-role");
            const requiredRoles = requiredRolesAttribute.split(",");
            const authorized = userRoles.some(userRole => requiredRoles.includes(userRole));

            if (authorized) {
                element.classList.remove("hidden");
            }
            else {
                element.classList.add("hidden");
            }
        });

        // document.querySelectorAll("[data-toggle]").forEach((element: HTMLElement) => {
        //     ko.applyBindingsToNode(element, { toggleCollapsible: {} }, null);
        // });


        // TODO: Move out of visibility guard.
        const mousedown = (event: MouseEvent) => {
            const elements = Utils.elementsFromPoint(document, event.clientX, event.clientY);
            const toggleElement = elements.find(x => x.getAttribute("data-toggle"));

            if (!toggleElement) {
                return;
            }

            const collapsible: HTMLElement = toggleElement.parentElement.parentElement.querySelector(".collapsible");

            if (collapsible) {
                collapsible.classList.toggle("expanded");
            }
        };

        document.addEventListener("mousedown", mousedown, true);
    }
}


