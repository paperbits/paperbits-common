import { RoleModel } from ".";

/**
 * User role management service.
 */
export interface RoleService {
    /**
     * Returns all available roles.
     */
    getRoles(): Promise<RoleModel[]>;
}