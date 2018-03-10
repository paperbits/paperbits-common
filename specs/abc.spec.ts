import { describe, it, assert } from "mocha";

var abc = (): Promise<string> => {
    return new Promise<string>((resolve) => {
        setTimeout(() => {
            resolve("Hi!");
        }, 2000);
    });
}

describe('My tests', async () => {
    it('Test 1', async () => {

    });

    it('Test 2', async () => {
        const result = await abc();
        console.log(result);
    });

    it('Test 3', async () => {

    });
});