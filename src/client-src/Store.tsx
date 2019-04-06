import * as React from "react";
import { createContext, useReducer } from "react";
import { log } from "./index";
import { Action, IFormState, SetAction } from "./Types";

export class State {
    public level: number;
    public numBlocks: number;
    public intro: string;
    public warmup: string;
    public blocks: Array<{
        intro?: string;
        exercises?: string[];
    }>;
    public outro: string;

    constructor(init: IFormState) {
        this.level = init.level;
        this.numBlocks = init.numBlocks;
        this.intro = init.intro;
        this.warmup = init.warmup;
        this.blocks = init.blocks;
        this.outro = init.outro;
    }

    public get(key: string) {
        let ret: any = this;
        const props = idToPath(key).split(".");
        for (const prop of props) {
            if (prop in ret) {
                ret = ret[prop];
            } else {
                log.error(`"${key}" not in "${JSON.stringify(this)}"`);
                return undefined;
            }
        }
        return ret;
    }

    public set(path: string, value: any) {
        setDeepValue(this, path, value);
    }

    public updateBlocks() {
        while (this.blocks.length != this.numBlocks) {
            if (this.blocks.length < this.numBlocks) {
                this.blocks.push({});
            } else {
                this.blocks.pop();
            }
        }
    }
}

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
 * Handles actions for storeState
 *
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function reducer(state: State, action: SetAction): State {
    if (action.type !== "set") {
        throw new Error(`Type "${action.type}" not recognized`);
    }

    const newState = new State({ ...state });
    const n = Number(action.payload.value);

    if (!isNaN(n)) {
        action.payload.value = n;
    }
    newState.set(idToPath(action.payload.key), action.payload.value);
    newState.updateBlocks();
    return newState;
}

export const initState = new State({
    blocks: [{}],
    level: 1,
    numBlocks: 1,

});

export const StoreContext = createContext<[IFormState, React.Dispatch<SetAction>]>([
    initState,
    () => { throw new Error("no reducer has been set"); },
]);

export function Store({ children }: { children: any; }): JSX.Element {
    const [state, dispatch] = useReducer(reducer, initState);
    return (<StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>);
}
