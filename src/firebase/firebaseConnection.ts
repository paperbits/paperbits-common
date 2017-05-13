import { IEventManager } from "./../events/IEventManager";
import { FirebaseService } from '../firebase/firebaseService';

export class FirebaseConnection {
    private readonly firebaseService: FirebaseService;
    private readonly eventManager: IEventManager;

    constructor(firebaseService: FirebaseService, eventManager: IEventManager) {
        this.firebaseService = firebaseService;
        this.eventManager = eventManager;

        var connectedRef = firebase.database().ref(".info/connected");

        connectedRef.on("value", (snapshot) => {
            if (snapshot.val() === true) {
                this.eventManager.dispatchEvent("onOnlineStatusChanged", "online");
            }
            else {
                this.eventManager.dispatchEvent("onOnlineStatusChanged", "offline");
            }
        });
    }
}