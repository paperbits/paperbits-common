import { Query } from "../persistence/query";
import { Bag } from "../bag";

export interface IObjectStorage {
    /**
     * Creates object with specified key in storage.
     * @template T Type of created object.
     * @param key string Object key.
     * @param dataObject T Object.
     */
    addObject<T>(key: string, dataObject: T): Promise<void>;

    /**
     * Retrieves an object from storage by specified key.
     * @template T Type of retrieved object.
     * @param key string Object key.
     */
    getObject<T>(key: string): Promise<T>;

    /**
     * Deletes an object with specfied key in stoage.
     * @param key string Object key.
     */
    deleteObject(key: string): Promise<void>;

    /**
     * Updates object with specified key in storage.
     * @template T Type of updated object.
     * @param key string Object key.
     * @param dataObject {T} Object.
     */
    updateObject<T>(key: string, dataObject: T): Promise<void>;

    searchObjects<T>(key: string, query?: Query<T>): Promise<Bag<T>>;

    saveChanges?(delta: Object): Promise<void>;

    loadData?(): Promise<object>;
}
