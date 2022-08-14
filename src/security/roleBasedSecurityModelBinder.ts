import { RoleBasedSecurityContract } from "./roleBasedSecurityContract";
import { RoleBasedSecurityModel } from "./roleBasedSecurityModel";
import { SecurityModelBinder } from "./securityModelBinder";


export class RoleBasedSecurityModelBinder implements SecurityModelBinder<RoleBasedSecurityContract, RoleBasedSecurityModel> {
    public modelToContract(model: RoleBasedSecurityModel): RoleBasedSecurityContract {
        return { roles: model.roles }
    }

    public contractToModel(contract: RoleBasedSecurityContract): RoleBasedSecurityModel {
        const model = new RoleBasedSecurityModel();
        model.roles = contract.roles;
        return model;
    }
}
