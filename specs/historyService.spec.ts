import { HistoryService } from "../src/history/historyService";
import { expect, assert } from "chai";

describe("History", async () => {
    const mockEventManager: any = { addEventListener: (eventName, callback) => { return; } };

    it("Can do, undo, and redo changes.", async () => {
        const history = new HistoryService(mockEventManager);
        const state = {
            name: "John Doe",
            address: {
                streetNumber: 2000,
                street: "South Eads"
            }
        };

        const changes1 = {
            address: {
                streetNumber: 1999
            }
        };

        const changes2 = {
            address: {
                streetNumber: 1998
            }
        };

        const changes3 = {
            address: {
                street: "S Eads"
            }
        };

        const changes4 = {
            address: null
        };

        expect(state.address.streetNumber).equal(2000);
        expect(state.address.street).equal("South Eads");

        history.merge(state, changes1);
        expect(state.address.streetNumber).equal(1999);
        expect(state.address.street).equal("South Eads");

        history.merge(state, changes2);
        expect(state.address.streetNumber).equal(1998);
        expect(state.address.street).equal("South Eads");

        history.merge(state, changes3);
        expect(state.address.streetNumber).equal(1998);
        expect(state.address.street).equal("S Eads");

        history.merge(state, changes4);
        expect(state.address).equal(undefined);


        /* Undoing */
        history.undo(); // Undoing changes 4
        expect(state.address.streetNumber).equal(1998);
        expect(state.address.street).equal("S Eads");

        history.undo(); // Undoing changes 3
        expect(state.address.streetNumber).equal(1998);
        expect(state.address.street).equal("South Eads");

        history.undo(); // Undoing changes 2
        expect(state.address.streetNumber).equal(1999);
        expect(state.address.street).equal("South Eads");

        history.undo(); // Undoing changes 1
        expect(state.address.streetNumber).equal(2000);
        expect(state.address.street).equal("South Eads");


        /* Redoing */
        history.redo(); // Redoing changes 1
        expect(state.address.streetNumber).equal(1999);
        expect(state.address.street).equal("South Eads");

        history.redo(); // Redoing changes 2
        expect(state.address.streetNumber).equal(1998);
        expect(state.address.street).equal("South Eads");

        history.redo(); // Redoing changes 3
        expect(state.address.streetNumber).equal(1998);
        expect(state.address.street).equal("S Eads");
    });

    it("Can do, undo, and redo changes at any level.", async () => {
        const employee = {
            name: "John Doe",
            address: {
                streetNumber: 2000,
                street: "South Eads"
            }
        };

        const organization = {
            name: "Paperbits",
            departments: [{
                name: "Department 1",
                employees: [employee]
            }]
        };

        const changes1 = {
            address: {
                streetNumber: 1999
            }
        };

        const changes2 = {
            name: "Paperbits, LLC"
        };

        const changes3 = {
            departments: null
        };

        const history = new HistoryService(mockEventManager);
        history.merge(employee, changes1); // employee level
        expect(organization.departments[0].employees[0].address.streetNumber).equal(1999);

        history.merge(organization, changes2); // organization level
        expect(organization.name).equal("Paperbits, LLC");
        expect(organization.departments[0].employees[0].address.streetNumber).equal(1999);

        history.merge(organization, changes3); // organization level
        expect(organization.name).equal("Paperbits, LLC");
        expect(organization.departments).equal(undefined);

        history.undo();
        expect(organization.name).equal("Paperbits, LLC");
        expect(organization.departments[0].employees[0].address.streetNumber).equal(1999);

        history.undo();
        expect(organization.name).equal("Paperbits");
        expect(organization.departments[0].employees[0].address.streetNumber).equal(1999);

        history.undo();
        expect(organization.name).equal("Paperbits");
        expect(organization.departments[0].employees[0].address.streetNumber).equal(2000);

        expect(employee).equal(organization.departments[0].employees[0]);
    });

    it("Can do, undo, and redo changes with simple objects.", async () => {
        const history = new HistoryService(mockEventManager);

        const state = {
            name: "John Doe",
            address: {
                streetNumber: 2000,
                street: "South Eads"
            }
        };

        const changes1 = {
            streetNumber: 1999
        };

        expect(state.address.streetNumber).equal(2000);
        expect(state.address.street).equal("South Eads");

        history.setValueAt("address", state, changes1);
        expect(state.address.streetNumber).equal(1999);
        assert.isUndefined(state.address.street);

        history.undo();
        console.log(JSON.stringify(state, null, 4));
        expect(state.address.streetNumber).equal(2000);
        expect(state.address.street).equal("South Eads");
    });
});