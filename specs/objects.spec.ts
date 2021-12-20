import * as Objects from "../src/objects";
import { assert, expect } from "chai";


function removeFromArray(array, item) {
    const copy = Array.from(array);
    const index = copy.indexOf(item);
    copy.splice(index, 1);

    return copy;
}

describe("Objects", async () => {
    it("Merge deep. Can apply chages and undo them.", async () => {
        const target = {
            firstName: "John",
            lastName: "Doe",
            address: {
                streetNumber: 2000,
                street: "South Eads",
            },
            roles: ["guest", "developer"]
        };

        const changes = {
            firstName: "Jane",
            lastName: "Doe",
            address: {
                streetNumber: 1999,
                street: "S Eads"
            },
            roles: target.roles.concat(["administrator"])
        };

        const originalSnapshot = JSON.stringify(target);
        const delta = Objects.mergeDeep(target, changes); // Applying changes

        Objects.mergeDeep(target, delta); // Undoing changes
        const finalSnapshot = JSON.stringify(target);

        expect(originalSnapshot).equal(finalSnapshot);
    });

    it("Can merge deep arrays.", async () => {
        const target = {
            sections: [{
                rows: [{
                    columns: [{
                        prop: "Hello"
                    }]
                }]
            }]
        };

        const row = target.sections[0].rows[0];
        const newColumnsArray = removeFromArray(row, target.sections[0].rows[0].columns[0]);

        const rowChanges = {
            columns: newColumnsArray
        };

        const rowDelta = Objects.mergeDeep(row, rowChanges);

        const newSectionsArray = removeFromArray(target, target.sections[0]);

        const targetChanges = {
            sections: newSectionsArray
        };

        const targetDelta = Objects.mergeDeep(target, targetChanges);

        Objects.mergeDeep(row, rowDelta);
        Objects.mergeDeep(target, targetDelta);
    });

    it("Can merge deep. Can merge at objects at any level.", async () => {
        const target1 = { parent: { child: { property1: "value1", property2: "value2" } } };
        const source1 = { property2: null };
        Objects.mergeDeepAt("parent/child", target1, source1, false);
        expect(target1.parent.child.property2).equal(null);

        const target2 = { parent: { child: { property1: "value1", property2: "value2" } } };
        const source2 = { property2: null };
        Objects.mergeDeepAt("parent/child", target2, source2, true);
        expect(target2.parent.child.property2).equal(undefined);
    });

    it("Can set value at specific path.", () => {
        const target: any = { address: { street: "South Eads" } };
        const compensation1: any = Objects.setValueWithCompensation("address/streetNumber", target, 2000);
        const compensation2: any = Objects.setValueWithCompensation("address/street", target, "S Eads");

        expect(target.address.streetNumber).equal(2000);
        expect(compensation1).equals(undefined);
        expect(compensation2).equals("South Eads");
    });

    it("Can generate changeset.", () => {
        const original: any = {
            firstName: "John",
            address1: { street: "South Eads" },
            address2: { street: "South Eads" },
            address3: { street: "South Eads" },
        };

        const changes: any = {
            address1: {
                streetNumber: 10
            },
            address3: { street: null }
        };

        const actualResult = Objects.generateChangeset(original, changes, true);

        const expectedResult: any = {
            address1: { streetNumber: 10, street: null },
            address3: null,
            firstName: null,
            address2: null
        };

        const serializedActual = JSON.stringify(actualResult);
        const serializedExpected = JSON.stringify(expectedResult);

        console.log(serializedActual);
        console.log(serializedExpected);

        assert.equal(serializedActual, serializedExpected);
    });

    it("Can cleanup object without removing nulls but collapsing nul objects.", () => {
        const original: any = {
            firstName: "John",
            address1: { street: null },
            address2: undefined
        };

        Objects.cleanupObject(original, { collapseNulls: true });

        const actual = JSON.stringify(original);
        const expected = `{"firstName":"John","address1":null}`;

        console.log(actual);
        assert.equal(actual, expected);
    });

    it("Can cleanup object including nulls.", () => {
        const original1: any = {
            firstName: "John",
            address1: { street: null },
            address2: undefined
        };

        Objects.cleanupObject(original1, { removeNulls: true }); // Cleanup including nulls.

        const actual = JSON.stringify(original1);
        const expected = `{"firstName":"John"}`;

        console.log(actual);
        assert.equal(actual, expected);
    });
});