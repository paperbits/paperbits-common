import { IUserService } from "../user/IUserService";
import { FirebaseService } from "./firebaseService";

export class FirebaseUserService implements IUserService {
    constructor(private firebaseService: FirebaseService) {
    }

    public async getUserPhotoUrl(): Promise<string> {
        await this.firebaseService.getFirebaseRef();

        if (!this.firebaseService.authenticatedUser) {
            return null;
        }
        return this.firebaseService.authenticatedUser.photoURL;
    }
}