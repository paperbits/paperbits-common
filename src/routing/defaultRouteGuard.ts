import { IRouteGuard } from ".";

export class DefaultRouteGuard implements IRouteGuard {
    public async canActivate(route: string, metadata?: Object): Promise<boolean> {
        return true;
    }
}