import { IObjectStorage, OfflineObjectStorage } from "../persistence";
import { IInjector, IInjectorModule } from "../injection";


/**
 * Module registering components required for offline work.
 */
export class OfflineModule implements IInjectorModule {
    constructor() {
        this.register = this.register.bind(this);
    }

    public register(injector: IInjector): void {
        // injector.bindSingleton("offlineServiceWorker", OfflineServiceWorker);
        injector.bindSingleton("offlineObjectStorage", OfflineObjectStorage);

        const underlyingObjectStorage = injector.resolve<IObjectStorage>("objectStorage");

        injector.bindSingletonFactory<IObjectStorage>("objectStorage", (ctx: IInjector) => {
            const offlineObjectStorage = ctx.resolve<OfflineObjectStorage>("offlineObjectStorage");
            offlineObjectStorage.registerUnderlyingStorage(underlyingObjectStorage);

            return offlineObjectStorage;
        });
    }
}