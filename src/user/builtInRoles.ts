import { RoleModel } from "./roleModel";

export class BuiltInRoles {
    public static everyone: RoleModel = { key: "everyone", name: "Everyone" };
    public static anonymous: RoleModel = { key: "anonymous", name: "Anonymous" };
    public static authenticated: RoleModel = { key: "authenticated", name: "Authenticated" };
}