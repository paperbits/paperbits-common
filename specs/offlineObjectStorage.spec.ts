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
        }        ,
        employee5: {
            key: "employees/employee5",
            firstName: "Employee 5"
        }
    }
};

describe("Offline object storage", async () => {
    it("Can correctly reflect the state.", async () => {
        const memoryCache = new MemoryCache();
        const obs = new OfflineObjectStorage(memoryCache);
        const changesObject: any = obs["changesObject"];
        const stateObject: any = obs["stateObject"];
        Object.assign(stateObject, initialData1); // assigning initial state

        /* Trying to update object
           - Changes object at specified path should reflect the same object as state;
        */
        await obs.updateObject("address", { streetNumber: 2001, description: "Billing address" });
        expect(stateObject.address.streetNumber).equal(2001);
        expect(stateObject.address.street).equal(undefined);
        expect(stateObject.address.description).equal("Billing address");
        expect(changesObject.address.streetNumber).equal(2001);
        expect(changesObject.address.street).equal(undefined);
        expect(changesObject.address.description).equal("Billing address");

        /* Trying to delete object:
           - State object should be cleaned of the node;
           - Changes object should have "null" to indicate deletion;
        */
        await obs.deleteObject("address");
        expect(stateObject.address).equal(undefined);
        expect(changesObject.address).equal(null);

        /* Trying to add object
           - Changes object at specified path should reflect the same object as state;
        */
        await obs.addObject("address", { streetNumber: 2000 });
        expect(stateObject.address.streetNumber).equal(2000);
        expect(changesObject.address.streetNumber).equal(2000);
    });

    it("Can apply chages and undo them.", async () => {
        const memoryCache = new MemoryCache();
        const obs = new OfflineObjectStorage(memoryCache);
        const changesObject: any = obs["changesObject"];
        const stateObject: any = obs["stateObject"];

        Object.assign(stateObject, initialData1); // assigning initial state
        expect(stateObject.address.streetNumber).equal(2000);
        expect(changesObject.address, "When no changes has been made yet, changesObject should be empty").equals(undefined);

        await obs.updateObject("address/streetNumber", null);
        expect(stateObject.address.streetNumber).equal(undefined);

        obs.undo();
        expect(stateObject.address.streetNumber).equal(2000);
        expect(changesObject.address, "Undo should rollback changesObject as well").equals(undefined);
    });

    it("Can get object taking changes into account.", async () => {
        /**
         * Scenario 1. Check if object exists locally. If yes, return it (without querying remote).
         * Scenario 2. Check if object deleted locally. If yes, return null.
         * Scenario 3. Query remote. If returned, cache locally.
         */

        const memoryCache = new MemoryCache();
        const remoteObjectStorage: MockObjectStorage = new MockObjectStorage(initialData2);
        const obs = new OfflineObjectStorage(memoryCache);
        obs.setRemoteObjectStorage(remoteObjectStorage);
        obs.isOnline = true;

        /* First query: employee1 is not cached yet, so remote storage gets called. */
        const result1 = await obs.getObject("employees/employee1");
        assert.isNotNull(result1);
        expect(remoteObjectStorage.requestCount).equals(1);

        /* Second query: employee1 already cached, so remote storage doesn't get called. */
        const result2 = await obs.getObject("employees/employee1");
        assert.isNotNull(result2); console.log(result2);
        expect(remoteObjectStorage.requestCount).equals(1); // number of remote requests still 1.

        /* Deleting employee1 locally */
        await obs.deleteObject("employees/employee1");

        /* Third query: employee1 deleted locally, no need to call remote. */
        const result3 = await obs.getObject("employees/employee1");
        assert.isUndefined(result3); // must be undefined
        expect(remoteObjectStorage.requestCount).equals(1); // number of remote requests still 1.
    });

    // it("Can do search taking changes into account.", async () => {
    //     /**
    //      * How search works:
    //      * 1. Take whole page from remote search results;
    //      * 2. Remove deleted objects using CHANGES object;
    //      * 3. Add added/modified object using CHANGES object;
    //      */

    //     const memoryCache = new MemoryCache();
    //     const remoteObjectStorage: MockObjectStorage = new MockObjectStorage(initialData3);
    //     const obs = new OfflineObjectStorage(memoryCache);
    //     obs.setRemoteObjectStorage(remoteObjectStorage);
    //     obs.isOnline = true;

    //     const query = Query
    //         .from<any>();

    //     // Creating local changes:
    //     await obs.addObject("employees/employeeA", { key: "employees/employeeA", firstName: "Employee A" });
    //     await obs.addObject("employees/employeeB", { key: "employees/employeeB", firstName: "Employee B" });
    //     await obs.addObject("employees/employeeC", { key: "employees/employeeC", firstName: "Employee C" });
    //     await obs.deleteObject("employees/employee2");

    //     const page1 = await obs.searchObjects("employees", query);
    //     const page1Keys = Object.keys(page1.value);
    //     console.log(`Page 1: ${page1Keys.join(",")}`);
    //     assert(page1Keys.includes("employeeA") && page1Keys.includes("employeeB"), "Page 1 must inlcude employees A and B.");

    //     const page2 = await obs.searchObjects("employees", page1.nextPage);
    //     const page2Keys = Object.keys(page2.value);
    //     console.log(`Page 2: ${page2Keys.join(",")}`);
    //     assert(page2Keys.includes("employeeC") && page2Keys.includes("employee1"), "Page 2 must inlcude employees C and 1.");

    //     const page3 = await obs.searchObjects("employees", page2.nextPage);
    //     const page3Keys = Object.keys(page3.value);
    //     console.log(`Page 3: ${page3Keys.join(",")}`);
    //     assert(page3Keys.includes("employee3"), "Page 3 must inlcude only employee 3 (employee 2 was deleted locally, so page reduced to 1 item).");

    //     const page4 = await obs.searchObjects("employees", page3.nextPage);
    //     const page4Keys = Object.keys(page4.value);
    //     console.log(`Page 4: ${page4Keys.join(",")}`);
    //     assert(page4Keys.includes("employee4") && page4Keys.includes("employee5"), "Page 4 must inlcude employees 4 and 5.");
    // });

    it("Performs getObject taking changes into account.", async () => {
        const memoryCache = new MemoryCache();
        const remoteObjectStorage: any = new MockObjectStorage();
        const obs = new OfflineObjectStorage(memoryCache);
        obs.setRemoteObjectStorage(remoteObjectStorage);
        obs.isOnline = true;

        await obs.deleteObject("employees/employee1");

        const getObjectResult = await obs.getObject<any>("employees/employee1");
        expect(getObjectResult).equals(undefined);
    });
});