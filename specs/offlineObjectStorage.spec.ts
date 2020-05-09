import { OfflineObjectStorage } from "../src/persistence";
import * as Objects from "../src/objects";
import { assert, expect } from "chai";
import { MemoryCache } from "../src/caching";


const initialData = {
    firstName: "John",
    lastName: "Doe",
    address: {
        streetNumber: 2000,
        street: "South Eads",
    },
    roles: ["guest", "developer"]
};

class MockStorage {
    private data: any = {
        employees: {
            employee1: {
                key: "employees/employee1",
                firstName: "John"
            },
            employee2: {
                key: "employees/employee1",
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

    public searchObjects(key: string): any {
        return Objects.getObjectAt(key, this.data);
    }

    public async getObject<T>(path: string): Promise<T> {
        return Objects.getObjectAt(path, Objects.clone(this.data));
    }
}

describe("Offline object storage", async () => {
    it("Can correctly reflect the state.", async () => {
        const memoryCache = new MemoryCache();
        const obs = new OfflineObjectStorage(memoryCache);
        const changesObject: any = obs["changesObject"];
        const stateObject: any = obs["stateObject"];
        Object.assign(stateObject, initialData); // assigning initial state

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

        Object.assign(stateObject, initialData); // assigning initial state
        expect(stateObject.address.streetNumber).equal(2000);
        expect(changesObject.address, "When no changes has been made yet, changesObject should be empty").equals(undefined);

        await obs.updateObject("address/streetNumber", null);
        expect(stateObject.address.streetNumber).equal(undefined);

        obs.undo();
        expect(stateObject.address.streetNumber).equal(2000);
        expect(changesObject.address, "Undo should rollback changesObject as well").equals(undefined);
    });

    it("Can do search taking changes into account.", async () => {
        const memoryCache = new MemoryCache();
        const underlyingStorage: any = new MockStorage();
        const obs = new OfflineObjectStorage(memoryCache);
        obs.registerUnderlyingStorage(underlyingStorage);
        obs.isOnline = true;
        const changesObject: any = obs["changesObject"];
        const stateObject: any = obs["stateObject"];

        await obs.deleteObject("employees/employee1");
        await obs.updateObject("employees/employee2", {
            key: "employees/employee2",
            firstName: "Janne",
            lastName: "Doe"
        });

        const searchResult1 = await obs.searchObjects<any>("employees");

        assert.isUndefined(searchResult1.employee1);
        assert.isNotNull(searchResult1.employee2);
        expect(searchResult1.employee2.lastName).equals("Doe");

        const searchResult2 = await obs.searchObjects<any>("files");
        assert.isNotNull(searchResult2.file1);
        assert.isNotNull(searchResult2.file2);
        assert.isUndefined(searchResult2.employees); // Ensure not previous results mixed in.

        assert.isUndefined(stateObject.employees.employee1);
        assert.isNotNull(stateObject.employees.employee2);
        assert.isNotNull(stateObject.files.file1);
        assert.isNotNull(stateObject.files.file2);
        assert.isNull(changesObject.employees.employee1);
    });

    it("Performs getObject taking changes into account.", async () => {
        const memoryCache = new MemoryCache();
        const underlyingStorage: any = new MockStorage();
        const obs = new OfflineObjectStorage(memoryCache);
        obs.registerUnderlyingStorage(underlyingStorage);
        obs.isOnline = true;

        await obs.deleteObject("employees/employee1");

        const getObjectResult = await obs.getObject<any>("employees/employee1");
        expect(getObjectResult).equals(undefined);
    });
});