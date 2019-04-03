import * as React from "react";
import { createContext, useReducer } from "react";
import { Action, State } from "./Types";

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
    switch (action.payload.key) {
        case "numBlocks":
            newState.blocks = new Array(Number(action.payload.value));
            const last = min(state.blocks.length, newState.blocks.length);
            for (let i = 0; i < last; i++) {
                newState.blocks[i] = state.blocks[i];
            }
            for (let i = last - 1; i < newState.blocks.length; i++) {
                newState.blocks[i] = {};
            }
        case "level":
            newState[action.payload.key] = Number(action.payload.value);
            break;
        default:
            // const blockNum = blockNumber(action.payload.key);
            // if (blockNum !== 0) {
            //     newState.blocks[blockNum - 1][action.payload.key] = action.payload.value;
            // } else {
            newState[action.payload.key] = action.payload.value;
        // }
    }
    return newState;
}

type butt = (state: State) => string;
type Type = React.Dispatch<SetAction> | ((state: State, action: Action) => State);

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

export const StoreContext = createContext<[State, React.Dispatch<SetAction>]>([initState, defaultDispatcher]);

export function Store({ children }: { children: any; }): JSX.Element {
    const [state, dispatch] = useReducer(reducer, initState);
    return (<StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>);
}
