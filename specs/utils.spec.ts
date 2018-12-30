import * as Utils from "../src/utils";
import { assert } from "chai";

describe("Utils", async () => {
    it("Deep merge", async () => {
        const target = {
            age: 30,
            address: {
                house: 2000,
                street: "South Eads",
                appartment: 209
            },
            deleted: {
                deletedChild: 100
            },
            array: [{ orignal: 100 }]
        };

        const source = {
            height: 175,
            address: {
                house: 2000,
                street: "South Eads",
                appartment: null
            },
            deleted: null,
            array: [{ new: 200 }]
        };

        Utils.mergeDeep(target, source);

        const result = JSON.stringify(target);

        assert.isTrue(result === `{"age":30,"address":{"house":2000,"street":"South Eads","appartment":null},"deleted":null,"array":[{"new":200}],"height":175}`);
    });
});