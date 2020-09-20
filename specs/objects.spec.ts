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

    it("Merge deep. Arrays.", async () => {
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

    it("Merge deep. Can merge at objects at any level.", async () => {
        const target1 = { parent: { child: { property1: "value1", property2: "value2" } } };
        const source1 = { property2: null };
        Objects.mergeDeepAt("parent/child", target1, source1, false);
        expect(target1.parent.child.property2).equal(null);

        const target2 = { parent: { child: { property1: "value1", property2: "value2" } } };
        const source2 = { property2: null };
        Objects.mergeDeepAt("parent/child", target2, source2, true);
        expect(target2.parent.child.property2).equal(undefined);
    });


    it("Set value at specific path.", () => {
        const target: any = { address: { street: "South Eads" } };
        const compensation1: any = Objects.setValueWithCompensation("address/streetNumber", target, 2000);
        const compensation2: any = Objects.setValueWithCompensation("address/street", target, "S Eads");

        expect(target.address.streetNumber).equal(2000);
        expect(compensation1).equals(undefined);
        expect(compensation2).equals("South Eads");
    });
});