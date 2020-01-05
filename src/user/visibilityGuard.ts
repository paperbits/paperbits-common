import { UserService } from "./userService";
import { EventManager } from "../events";


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
    }
}