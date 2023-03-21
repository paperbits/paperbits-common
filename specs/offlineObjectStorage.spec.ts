import { OfflineObjectStorage, Query } from "../src/persistence";
import { assert, expect } from "chai";
import { MemoryCache } from "../src/caching";
import { MockObjectStorage } from "./mocks/mockObjectStorage";


const initialData1 = {
    firstName: "John",
    lastName: "Doe",
    address: {
        streetNumber: 2000,
        street: "South Eads",
    },
    roles: ["guest", "developer"]
};

const initialData2: any = {
    employees: {
        employee1: {
            key: "employees/employee1",
            firstName: "John"
        },
        employee2: {
            key: "employees/employee2",
            firstName: "Janne"
        }
    },
    files: {
        file1: {
            key: "files/file1",
        },
        file2: {
            key: "files/file1",
        }
    }
};

const initialData3: any = {
    employees: {
        employee1: {
            key: "employees/employee1",
            firstName: "Employee 1"
        },
        employee2: {
            key: "employees/employee2",
            firstName: "Employee 2"
        },
        employee3: {
            key: "employees/employee3",
            firstName: "Employee 3"
        },
        employee4: {
            key: "employees/employee4",
            firstName: "Employee 4"
        },
        employee5: {
            key: "employees/employee5",
            firstName: "Employee 5"
        }
    }
};

const changesObjectCacheKey: string = "changesObject";
const stateObjectCacheKey: string = "stateObject";

describe("Offline object storage", async () => {
    it("Can correctly reflect the state.", async () => {
        const stateCache = new MemoryCache();
        const changesCache = new MemoryCache();
        const obs = new OfflineObjectStorage(stateCache, changesCache);

        await stateCache.setItem(stateObjectCacheKey, initialData1); // assigning initial state

        let changesObject: any;
        let stateObject: any;

        // 1. Update object operation:
        await obs.updateObject("address", { streetNumber: 2001, description: "Billing address" }, "changeDescriptionValue");
        stateObject = await stateCache.getItem(stateObjectCacheKey);
        changesObject = await changesCache.getItem(changesObjectCacheKey);

        // Changes object at specified path should reflect the same object as state:
        expect(stateObject.address.streetNumber).equal(2001);
        expect(stateObject.address.street).equal(undefined);
        expect(stateObject.address.description).equal("Billing address");
        expect(changesObject.address.streetNumber).equal(2001);
        expect(changesObject.address.street).equal(undefined);
        expect(changesObject.address.description).equal("Billing address");


        // 2. Delete object operation
        await obs.deleteObject("address", "changeDescriptionValue");
        stateObject = await stateCache.getItem(stateObjectCacheKey);
        changesObject = await changesCache.getItem(changesObjectCacheKey);

        expect(stateObject.address).equal(undefined, "Deleted object must be removed from stateObject.");
        expect(changesObject.address).equal(null, "Changes object must have 'null' to indicate deletion.");


        // 3. Add object operation
        await obs.addObject("address", { streetNumber: 2000 }, "changeDescriptionValue");
        stateObject = await stateCache.getItem(stateObjectCacheKey);
        changesObject = await changesCache.getItem(changesObjectCacheKey);

        // Changes object at specified path should reflect the same object as state:
        expect(stateObject.address.streetNumber).equal(2000);
        expect(changesObject.address.streetNumber).equal(2000);
    });

    it("Can apply chages and undo them.", async () => {
        const stateCache = new MemoryCache();
        const changesCache = new MemoryCache();
        const obs = new OfflineObjectStorage(stateCache, changesCache);

        await stateCache.setItem(stateObjectCacheKey, initialData1); // assigning initial state

        let changesObject: any = await changesCache.getItem(changesObjectCacheKey);
        let stateObject: any = await stateCache.getItem(stateObjectCacheKey);

        expect(stateObject.address.streetNumber).equal(2000);
        expect(changesObject, "When no changes has been made yet, changesObject should be empty").equals(undefined);

        // 1. Update operation
        await obs.updateObject("address/streetNumber", null, "changeDescriptionValue");
        changesObject = await changesCache.getItem(changesObjectCacheKey);
        stateObject = await stateCache.getItem(stateObjectCacheKey);

        expect(changesObject.address.streetNumber).equal(null, "Changes object must preserve all the nulls (without collapsing them)");
        expect(stateObject.address.streetNumber).equal(undefined);

        // 2. Undo operation
        await obs.undo();
        changesObject = await changesCache.getItem(changesObjectCacheKey);
        stateObject = await stateCache.getItem(stateObjectCacheKey);

        expect(stateObject.address.streetNumber).equal(2000);
        expect(changesObject.address, "Undo should rollback changesObject as well.").equals(undefined);
    });

    it("Can get object taking changes into account.", async () => {
        /**
         * 1. Check if object exists locally. If yes, return it (without querying remote).
         * 2. Check if object deleted locally. If yes, return null.
         * 3. Query remote. If returned, cache locally.
         */

        const remoteObjectStorage: MockObjectStorage = new MockObjectStorage(initialData2);
        const stateCache = new MemoryCache();
        const changesCache = new MemoryCache();
        const obs = new OfflineObjectStorage(stateCache, changesCache);
        obs.setRemoteObjectStorage(remoteObjectStorage);

        /* First query: employee1 is not cached yet, so remote storage gets called. */
        const result1 = await obs.getObject("employees/employee1");
        assert.isNotNull(result1);
        expect(remoteObjectStorage.requestCount).equals(1);

        /* Second query: employee1 already cached, so remote storage doesn't get called. */
        const result2 = await obs.getObject("employees/employee1");
        assert.isNotNull(result2);
        expect(remoteObjectStorage.requestCount).equals(1); // number of remote requests still 1.

        /* Deleting employee1 locally */
        await obs.deleteObject("employees/employee1", "changeDescriptionValue");

        /* Third query: employee1 deleted locally, no need to call remote. */
        const result3 = await obs.getObject("employees/employee1");
        assert.isUndefined(result3); // must be undefined
        expect(remoteObjectStorage.requestCount).equals(1); // number of remote requests still 1.
    });

    it("Performs getObject taking changes into account.", async () => {
        const stateCache = new MemoryCache();
        const changesCache = new MemoryCache();
        const obs = new OfflineObjectStorage(stateCache, changesCache);
        const remoteObjectStorage: any = new MockObjectStorage();
        obs.setRemoteObjectStorage(remoteObjectStorage);

        await obs.deleteObject("employees/employee1", "changeDescriptionValue");

        const getObjectResult = await obs.getObject<any>("employees/employee1");
        expect(getObjectResult).equals(undefined);
    });
});