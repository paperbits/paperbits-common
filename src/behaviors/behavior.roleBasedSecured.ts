import { BuiltInRoles, UserService } from "../user";
import { EventManager, Events } from "../events";
import { RoleBasedSecurityModel } from "../security/roleBasedSecurityModel";
import { BehaviorHandle } from "./behavior";

export interface RoleBasedSecuredBehaviorConfig {
    initialSecurityModel?: RoleBasedSecurityModel;
    userService: UserService;
    eventManager: EventManager;
    onUpdate?: (roles: string | null, isHidden: boolean) => void;
}

export class RoleBasedSecuredBehavior {
    public static attach(element: HTMLElement, config: RoleBasedSecuredBehaviorConfig): BehaviorHandle {
        let currentSecurityModel = config.initialSecurityModel;
        let isHidden = false;
        let dataRole: string | null = null;

        const applyVisibility = async () => {
            const widgetRolesArray = currentSecurityModel?.roles || [BuiltInRoles.everyone.key];
            const userRoles = await config.userService.getUserRoles();
            const visibleToUser = userRoles.some(x => widgetRolesArray.includes(x)) || widgetRolesArray.includes(BuiltInRoles.everyone.key);

            isHidden = !visibleToUser;
            updateBindings();
        };

        const updateDataRole = () => {
            const widgetRolesArray = currentSecurityModel?.roles || [BuiltInRoles.everyone.key];
            if (widgetRolesArray.length === 1 && widgetRolesArray[0] === BuiltInRoles.everyone.key) {
                dataRole = null;
            } else {
                dataRole = widgetRolesArray.join(",");
            }
        };
        
        const updateBindings = () => {
            if (config.onUpdate) {
                config.onUpdate(dataRole, isHidden);
            }
        };

        const processSecurityModel = (securityModel?: RoleBasedSecurityModel) => {
            currentSecurityModel = securityModel;
            updateDataRole();
            applyVisibility(); // This will also call updateBindings
        };

        config.eventManager.addEventListener(Events.UserRoleChanged, applyVisibility);

        // Initial application
        processSecurityModel(currentSecurityModel);

        return {
            update: (newSecurityModel: RoleBasedSecurityModel) => {
                processSecurityModel(newSecurityModel);
            },
            detach: () => {
                config.eventManager.removeEventListener(Events.UserRoleChanged, applyVisibility);
            }
        };
    }
}
