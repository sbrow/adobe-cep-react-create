import * as React from "react";
import { createContext, useReducer } from "react";
import controller from "../controller";
import { Block, IFormState, SetAction } from "../Types";

export class AppStore {
    public level: number;
    public numBlocks: number;
    public library: string[];
    public intro: string;
    public warmup: string;
    public blocks: Block[];
    public outro: string;

    constructor(init: IFormState) {
        this.level = init.level;
        this.numBlocks = init.numBlocks;
        this.intro = init.intro;
        this.warmup = init.warmup;
        this.blocks = init.blocks;
        this.outro = init.outro;
        this.library = init.library;
    }

    /**
     * Returns an object from the store, given a
     * '.' delimited string.
     */
    public get(key: string) {
        let ret: any = this;
        const props = idToPath(key).split(".");
        for (const prop of props) {
            if (prop in ret) {
                ret = ret[prop];
            } else {
                if ("session" in window) {
                    // @ts-ignore
                    window.session.log(`"${key}" not in "${JSON.stringify(this)}"`, "error");
                }
                return undefined;
            }
        }
        return ret;
    }

    /**
     * Sets a property from the store to the given value. given a
     *
     * @param {string} path a '.' delimited string.
     * @param {*} value
     */
    public set(path: string, value: any) {
        setDeepValue(this, path, value);
    }

    /**
     * Adjusts the length of state.blocks to match state.numBlocks.
     *
     * @memberof AppStore
     */
    public updateBlocks() {
        while (this.blocks.length != this.numBlocks) {
            if (this.blocks.length < this.numBlocks) {
                this.blocks.push({ intro: "", exercises: [] });
            } else {
                this.blocks.pop();
            }
        }
    }

    public updateLibrary() {
        const fresh = getBins();
        if (fresh !== this.library) {
            reducer(this, {
                type: "set",
                payload: {
                    key: "library",
                    value: fresh,
                },
            });
        }
    }

    /**
     *
     *
     * @returns {string[]} valid File/Sequence names referenced by this store.
     * @memberof AppStore
     */
    public videos(): string[] {
        const imports = new Array<string>();
        try {
            const push = (...items: string[]) => {
                items.forEach((item) => {
                    switch (item) {
                        case undefined:
                        case null:
                        case "":
                            break;
                        default:
                            imports.push(item);
                    }
                });
            };
            push(this.intro, this.warmup);
            this.blocks.forEach((block) => {
                push(block.intro);
                if ("warmup" in block) {
                    push(block.warmup);
                }
                if (block.exercises !== undefined) {
                    push(...block.exercises);
                }
            });
        } catch (e) {
            window.alert(JSON.stringify(e));
        }
        // session.log(`videos: ${JSON.stringify(imports)}`);
        return imports;
    }

    /**
     * Loads the video files referenced in the AppStore's state.
     *
     * @returns {boolean} Whether all files were loaded successfully.
     * @memberof AppStore
     */
    public async insert(): Promise<boolean> {
        try {
            /**
             * @todo verify paths before loading.
             */
            // @ts-ignore
            // return window.session.run("alerts", "hello");
            const videos = this.videos();
            if (videos.length > 0) {
                window.alert(`inserting ${JSON.stringify(videos)}`);
                // @ts-ignore
                return window.session.run("insertClips", videos);
            }
        } catch (e) {
            window.alert(`error on insert: ${e}`);
        }
        return false;
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
            elems[i] = `; $; {
        n - 1;
    } `;
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
function reducer(state: AppStore, action: SetAction): AppStore {
    if (action.type !== "set") {
        throw new Error(`; Type; "${action.type}"; not; recognized`);
    }

    const newState = new AppStore({ ...state });
    const n = Number(action.payload.value);

    if (!isNaN(n) && action.payload.value !== "") {
        action.payload.value = n;
    }
    newState.set(idToPath(action.payload.key), action.payload.value);
    newState.updateBlocks();
    newState.updateLibrary();

    return newState;
}

function getBins(): string[] {
    try {
        // @ts-ignore
        window.session.run("getBins", null).then((res: string) => {
            window.alert(res)
            return JSON.parse(res);
        }).catch((error) => {
            window.alert(`run failed with: ${error}`);
            return [];
        });
    } catch (error) {
        window.alert(`Couldn't call run: ${error}`);
        window.alert(controller.logz.join("\r\n"));
        return [];
    }
}
export const initState = new AppStore({
    blocks: [{}],
    level: 1,
    numBlocks: 1,
    // library: getBins(),
    library: [],
});

export const StoreContext = createContext<[AppStore, React.Dispatch<SetAction>]>([
    initState,
    () => { throw new Error("no reducer has been set"); },
]);

export function StoreProvider({ children }: { children: any; }): JSX.Element {
    const [state, dispatch] = useReducer(reducer, initState);
    return (<StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>);
}
