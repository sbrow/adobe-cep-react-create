/* tslint:disable:only-arrow-functions */
import { deepEqual, strictEqual } from "assert";
import { describe, it } from "mocha";
const rewire = require("rewire");
const Store = rewire("../Store.tsx");
const App = rewire("../App.tsx");
const log = Store.__get__("log");

describe("Store", function () {
    describe("blockNumber", function () {
        interface Test { arg: string; want: number; }
        const tests: Test[] = [
            { arg: "some-thing", want: 0 },
            { arg: "block-thing", want: 0 },
            { arg: "block-1-thing", want: 1 },
            { arg: "block-3-stuff", want: 3 },
        ];
        const blockNumber = Store.__get__("blockNumber");
        for (const test of tests) {
            it(`Should return "${test.want}", given "${test.arg}".`, function () {
                const got = blockNumber(test.arg);
                strictEqual(got, test.want);
            });
        }
    });
    describe("setKey", function () {
        interface Test {
            arg: {
                obj: object
                key: string
                value: any,
            };
            want: any;
        }
        const obj1 = { blocks: [{ foo: "bar" }] };
        const tests: Test[] = [
            { arg: { obj: obj1, key: "blocks-1-foo", value: "fooer" }, want: { blocks: [{ foo: "fooer" }] } },
            { arg: { obj: { level: 12, ...obj1 }, key: "level", value: 1 }, want: { level: 1, ...obj1 } },
        ];
        const idToPath = Store.__get__("idToPath");
        const setDeepValue = Store.__get__("setDeepValue");
        for (const test of tests) {
            it(`Should return "${JSON.stringify(test.want)}", given "${JSON.stringify(test.arg)}".`, function () {
                setDeepValue(test.arg.obj, idToPath(test.arg.key), test.arg.value);
                const got = test.arg.obj;
                deepEqual(got, test.want);
            });
        }
    });
});
