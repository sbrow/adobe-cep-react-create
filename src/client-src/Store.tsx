import * as React from "react";
import { createContext, useReducer } from "react";
import { log } from "./index";
import { Action, State } from "./Types";

function setDeepValue(obj: object, path: string, val: any) {
    const props = path.split(".");
    const n = props.length - 1;
    for (let i = 0; i < n; ++i) {
        const key = (obj instanceof Array) ? `${Number(props[i])}` : props[i];
        const next = (i + 1 != n) ? Number(props[i + 1]) : null;
        const _default = (!(key in obj) && !isNaN(next)) ? [] : {};
        obj = obj[key] = obj[key] || _default;
    }
    obj[props[n]] = val;
    return obj;
}

function idToPath(id: string) {
    id = id.replace(/-/g, ".");
    const elems = id.split(".");
    for (let i = 0; i < elems.length; i++) {
        const n = Number(elems[i]);
        if (!isNaN(n)) {
            elems[i] = `${n - 1}`;
        }
    }
    return elems.join(".");
}

/**
 * @returns {number} Returns the smaller of a and b.
 */
function min(a: number, b: number): number {
    return (a < b) ? a : b;
}

function blockNumber(id: string): number {
    const matches = id.match(/^(block-)(\d)(-)/);
    if (matches !== null) {
        return Number(matches[2]);
    }
    return 0;
}

interface SetAction extends Action {
    type: "set";
    payload: {
        key: string,
        value: any,
    };
}

function updateBlocks(state: State, action: SetAction) {
    while (state.blocks.length != action.payload.value) {
        if (state.blocks.length < action.payload.value) {
            state.blocks.push({});
        } else {
            state.blocks.pop();
        }
    }
}

/**
 * Handles actions for storeState
 *
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function reducer(state: State, action: SetAction): State {
    const newState = { ...state };
    if (action.type !== "set") {
        throw new Error(`Type "${action.type}" not recognized`);
    }
    setDeepValue(newState, idToPath(action.payload.key), action.payload.value);
    if (action.payload.key.match("numBlocks")) {
        updateBlocks(newState, action);
    }
    return newState;
}

// export const StoreContext = createContext<[State, (state: State, action: SetAction) => State]>([initState, reducer]);

/** @throws "no reducer has been set" */
function defaultDispatcher(): void {
    throw new Error("no reducer has been set");
}

export const initState = {
    blocks: [{}],
    level: 1,
    numBlocks: 1,

};

export function get(state: State, key: string): any {
    let ret: any = state;
    const props = idToPath(key).split(".");
    for (const prop of props) {
        if (prop in ret) {
            ret = ret[prop];
        } else {
            log.error(`"${key}" not in "${JSON.stringify(state)}"`);
            return undefined;
        }
    }
    return ret;

}

export const StoreContext = createContext<[State, React.Dispatch<SetAction>]>([
    initState,
    () => { throw new Error("no reducer has been set"); },
]);

export function Store({ children }: { children: any; }): JSX.Element {
    const [state, dispatch] = useReducer(reducer, initState);
    return (<StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>);
}
