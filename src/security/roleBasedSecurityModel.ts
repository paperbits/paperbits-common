import { SecurityModel } from "./securityModel";

export class RoleBasedSecurityModel implements SecurityModel {
    public roles: string[];
}
