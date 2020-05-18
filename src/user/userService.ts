/**
 * Service for current user management.
 */
export interface UserService {
    /**
     * Returns display name of the current user.
     */
    getUserName(): Promise<string>;

    /**
     * Returns URL to current user's photo.
     */
    getUserPhotoUrl(): Promise<string>;

    /**
     * Returns current user's role keys.
     */
    getUserRoles(): Promise<string[]>;

    /**
     * Assigns roles to current user.
     * @param roles 
     */
    setUserRoles(roles: string[]): Promise<void>;
}