import { RoleBasedSecurityModel } from "./roleBasedSecurityModel";
import { SecurityContract } from "./securityContract";

export interface IAuthorizationService<TUser> {
    authorize(securityModel: SecurityContract, user: TUser): boolean;
}

export class AuthService implements IAuthorizationService<UserImpl> {
    public authorize(operation: RoleBasedSecurityModel, user: UserImpl): boolean {
        return true;
    }
}

export class UserImpl {

}

ko.bindingHandlers["secured"] = {
    init: (element: HTMLElement, valueAccessor: any) => {
        let authService = new AuthService();
        const auth = new RoleBasedSecurityModel();
        const user = new UserImpl();

        const isAuthorized = authService.authorize(auth, user);
    }
}