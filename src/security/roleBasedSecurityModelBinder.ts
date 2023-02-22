import { BuiltInRoles } from "../user";
import { RoleBasedSecurityContract } from "./roleBasedSecurityContract";
import { RoleBasedSecurityModel } from "./roleBasedSecurityModel";
import { SecurityModelBinder } from "./securityModelBinder";


export class RoleBasedSecurityModelBinder implements SecurityModelBinder<RoleBasedSecurityContract, RoleBasedSecurityModel> {
    public async contractToModel(contract: RoleBasedSecurityContract): Promise<RoleBasedSecurityModel> {
        const model = new RoleBasedSecurityModel();
        model.roles = contract.roles;
        return model;
    }

    public modelToContract(model: RoleBasedSecurityModel): RoleBasedSecurityContract {
        const roles = model.roles
            && model.roles.length === 1
            && model.roles[0] === BuiltInRoles.everyone.key
            ? null
            : model.roles;

        return { roles: roles }
    }
}
