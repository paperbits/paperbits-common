import { FirebaseObjectStorage } from "../firebase/firebaseObjectStorage";
import { FirebaseBlobStorage } from "../firebase/firebaseBlobStorage";
import { FirebaseService } from "../firebase/firebaseService";
import { FirebaseUserService } from "../firebase/firebaseUserService";
import { OfflineObjectStorage } from "../persistence/offlineObjectStorage";
import { IInjector, IInjectorModule } from "../injection";
import { IObjectStorage } from "../persistence/IObjectStorage";


export class FirebaseModule implements IInjectorModule {
    constructor() {
        this.register = this.register.bind(this);
    }

    public register(injector: IInjector): void {
        injector.bindSingleton("firebaseService", FirebaseService);
        injector.bindSingleton("userService", FirebaseUserService);
        injector.bindSingleton("blobStorage", FirebaseBlobStorage);

        injector.bindSingletonFactory<IObjectStorage>("objectStorage", (ctx: IInjector) => {
            var firebaseService = ctx.resolve<FirebaseService>("firebaseService");
            var objectStorage = new FirebaseObjectStorage(firebaseService);
            var offlineObjectStorage = ctx.resolve<OfflineObjectStorage>("offlineObjectStorage");

            offlineObjectStorage.registerUnderlyingStorage(objectStorage)

            return offlineObjectStorage;
        });
    }
}