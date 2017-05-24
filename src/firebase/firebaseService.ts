import * as firebase from "firebase";
import { ISettingsProvider } from '../configuration/ISettingsProvider';


export interface BasicFirebaseAuth {
    email: string;
    password: string;
}

export interface GithubFirebaseAuth {
    scopes: string[];
}

export interface FirebaseAuth {
    github: GithubFirebaseAuth;
    basic: BasicFirebaseAuth;
}

export class FirebaseService {
    private readonly settingsProvider: ISettingsProvider;

    private tenantRootKey: string;
    private preparingPromise: Promise<any>;

    constructor(settingsProvider: ISettingsProvider) {
        this.settingsProvider = settingsProvider;
    }

    private async applyConfiguration(firebaseSettings: Object): Promise<any> {
        //this.tenantRootKey = `tenants/${config.tenantId}`;
        this.tenantRootKey = "tenants/default";

        firebase.initializeApp(firebaseSettings); // This can be called only once
    }

    private async authenticate(auth: FirebaseAuth): Promise<any> {
        try {
            if (!auth) {
                console.info("Firebase: Signing-in anonymously...");
                await firebase.auth().signInAnonymously();
                return;
            }

            if (auth.github) {
                console.info("Firebase: Signing-in with Github...");
                let provider = new firebase.auth.GithubAuthProvider();

                if (auth.github.scopes) {
                    auth.github.scopes.forEach(scope => {
                        provider.addScope(scope);
                    })
                }

                let redirectResult = await firebase.auth().getRedirectResult();

                if (!redirectResult.credential) {
                    await firebase.auth().signInWithRedirect(provider);
                    return;
                }
                return;
            }

            if (auth.basic) {
                console.info("Firebase: Signing-in with email and password...");
                await firebase.auth().signInWithEmailAndPassword(auth.basic.email, auth.basic.password);
                return;
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    public async getFirebaseRef(): Promise<firebase.app.App> {
        if (this.preparingPromise) {
            return this.preparingPromise
        }

        this.preparingPromise = new Promise(async (resolve, reject) => {
            let firebaseSettings = await this.settingsProvider.getSetting("firebase");
            await this.applyConfiguration(firebaseSettings);
            await this.authenticate(firebaseSettings["auth"]);

            resolve(firebase);
        });

        return this.preparingPromise;
    }

    public async getDatabaseRef(): Promise<firebase.database.Reference> {
        let firebaseRef = await this.getFirebaseRef();
        let databaseRef = await firebaseRef.database().ref(this.tenantRootKey);

        return databaseRef;
    }

    public async getStorageRef(): Promise<firebase.storage.Reference> {
        let firebaseRef = await this.getFirebaseRef();
        let storageRef = firebaseRef.storage().ref(this.tenantRootKey);

        return storageRef;
    }
}