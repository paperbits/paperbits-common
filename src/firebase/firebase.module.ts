import { FirebaseObjectStorage } from '../firebase/firebaseObjectStorage';
import { FirebaseBlobStorage } from '../firebase/firebaseBlobStorage';
import { FirebaseService } from '../firebase/firebaseService';
import { OfflineObjectStorage } from '../persistence/offlineObjectStorage';
import { IInjectorModule } from '../injection/IRegistration';
import { IInjector } from '../injection/IInjector';
import { IObjectStorage } from '../persistence/IObjectStorage';


export class FirebaseModule implements IInjectorModule {
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

            if (this.useCache) {
                return new OfflineObjectStorage(objectStorage);
            }

            return objectStorage;
        });
    }
}