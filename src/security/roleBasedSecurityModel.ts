import { SecurityModel } from "./securityModel";

export class RoleBasedSecurityModel implements SecurityModel {
    roles: string;
}
