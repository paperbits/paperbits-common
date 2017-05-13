import { IViewManager } from "./../ui/IViewManager";
import { IEventManager } from '../events/IEventManager';
import { FirebaseObjectStorage } from '../firebase/firebaseObjectStorage';
import { FirebaseBlobStorage } from '../firebase/firebaseBlobStorage';
import { FirebaseService } from '../firebase/firebaseService';
import { OfflineObjectStorage } from '../persistence/offlineObjectStorage';
import { IRegistration } from '../injection/IRegistration';
import { IInjector } from '../injection/IInjector';
import { IObjectStorage } from '../persistence/IObjectStorage';


export class FirebaseRegistration implements IRegistration {
    private readonly useCache: boolean;

    constructor(useCache?: boolean) {
        this.useCache = useCache;
        this.register = this.register.bind(this);
    }

    public register(injector: IInjector): void {
        injector.bindSingleton("firebaseService", FirebaseService);
        injector.bindSingleton("blobStorage", FirebaseBlobStorage);

        injector.bindSingletonFactory<IObjectStorage>("objectStorage", (ctx: IInjector) => {
            var firebaseService = ctx.resolve<FirebaseService>("firebaseService");
            var objectStorage = new FirebaseObjectStorage(firebaseService);
            var eventManager = ctx.resolve<IEventManager>("eventManager");
            var viewManager = ctx.resolve<IViewManager>("viewManager");

            if (this.useCache) {
                return new OfflineObjectStorage(objectStorage, eventManager, viewManager);
            }

            return objectStorage;
        });
    }
}