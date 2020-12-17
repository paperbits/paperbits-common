import { IObjectStorage } from "../persistence";
import { IInjector, IInjectorModule } from "../injection";
import { CacheObjectStorage } from "./cachedObjectStorage";


export class CacheStorageModule implements IInjectorModule {
    public register(injector: IInjector): void {
        const underlyingObjectStorage = injector.resolve<IObjectStorage>("objectStorage");

        injector.bindSingletonFactory<IObjectStorage>("objectStorage", (ctx: IInjector) => {
            return new CacheObjectStorage(underlyingObjectStorage);
        });
    }
}