import { OfflineOptions } from "./offlineOptions";
import { IObjectStorage, OfflineObjectStorage, SavingHandler, LoadingHandler } from "../persistence";
import { IInjector, IInjectorModule } from "../injection";
import { UndoToolButton } from "./undoToolButton";
import { RedoToolButton } from "./redoToolButton";

/**
 * Module registering components required for offline work.
 */
export class OfflineModule implements IInjectorModule {
    constructor(private readonly options?: OfflineOptions) {
        this.register = this.register.bind(this);
    }

    public register(injector: IInjector): void {
        injector.bindToCollection("trayCommands", UndoToolButton);
        injector.bindToCollection("trayCommands", RedoToolButton);

        // injector.bindSingleton("offlineServiceWorker", OfflineServiceWorker);
        injector.bindSingleton("offlineObjectStorage", OfflineObjectStorage);

        const underlyingObjectStorage = injector.resolve<IObjectStorage>("objectStorage");

        injector.bindSingletonFactory<IObjectStorage>("objectStorage", (ctx: IInjector) => {
            const offlineObjectStorage = ctx.resolve<OfflineObjectStorage>("offlineObjectStorage");
            offlineObjectStorage.registerUnderlyingStorage(underlyingObjectStorage);
            offlineObjectStorage.autosave = this.options ? this.options.autosave : false;

            return offlineObjectStorage;
        });

        injector.bindToCollection("autostart", SavingHandler);
        injector.bindToCollection("autostart", LoadingHandler);
    }
}