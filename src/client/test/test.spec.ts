/* tslint:disable:only-arrow-functions */
import { deepEqual, strictEqual } from "assert";
import "jsdom";
import "jsdom-global";
import { describe, it } from "mocha";
import rewire from "rewire";

const Store = rewire("../Stores/AppStore.tsx");

describe("Store", function() {
    describe("idToPath", function() {
        interface Test { arg: string; want: string; }
        const tests: Test[] = [
            { arg: "some-thing", want: "some.thing" },
            { arg: "block-thing", want: "block.thing" },
            { arg: "block-1-thing", want: "block.0.thing" },
            { arg: "block-3-stuff", want: "block.2.stuff" },
        ];
        const idToPath = Store.__get__("idToPath");
        for (const test of tests) {
            it(`Should return "${test.want}", given "${test.arg}".`, function() {
                const got = idToPath(test.arg);
                strictEqual(got, test.want);
            });
        }
    });
    describe("setKey", function() {
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
            { arg: { obj: { ...obj1 }, key: "library", value: [] }, want: { library: [], ...obj1 } },
        ];
        const idToPath = Store.__get__("idToPath");
        const setDeepValue = Store.__get__("setDeepValue");
        for (const test of tests) {
            it(`Should return "${JSON.stringify(test.want)}", given "${JSON.stringify(test.arg)}".`, function() {
                setDeepValue(test.arg.obj, idToPath(test.arg.key), test.arg.value);
                const got = test.arg.obj;
                deepEqual(got, test.want);
            });
        }
    });
});
