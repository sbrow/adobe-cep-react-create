import * as React from "react";
import { createContext, useReducer } from "react";
import controller from "../controller";
import { Block, IFormState, ProjectItemType, SetAction } from "../Types";

export const importOption = "Import new...";

export class AppStore {
    public availableVideos: string[];
    public level: string;
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
        this.library = init.library || [];
        this.availableVideos = init.availableVideos || ["", importOption];
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
                const e = new Error(`"${key}" not in "${JSON.stringify(this)}"`);
                const stack = (e.stack !== undefined) ? e.stack.split("\n") : "";
                controller.error(e.message, { stack });
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
                if (block.warmup !== undefined) {
                    push(block.warmup);
                }
                if (block.exercises !== undefined) {
                    push(...block.exercises);
                }
            });
        } catch (e) {
            controller.error(JSON.stringify(e), { source: "state.videos" });
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
            // return window.session.run("alerts", "hello");
            const videos = this.videos();
            if (videos.length > 0) {
                controller.info(`inserting ${JSON.stringify(videos)}`);
                return window.session.run("insertClips", videos);
            }
        } catch (e) {
            controller.error(`${e}`, { source: "AppStore.insert" });
        }
        return false;
    }
}

function setDeepValue(obj: any, path: string, val: any): any {
    const source = "setDeepValue";
    const args = { obj, path, val };
    controller.debug(`${JSON.stringify(args)}`, { source });
    const props = path.split(".");
    const n = props.length - 1;
    for (let i = 0; i < n; ++i) {
        const key = (obj instanceof Array) ? `${Number(props[i])}` : props[i];
        const next = (i + 1 != n) ? Number(props[i + 1]) : Number(null);
        const defaultValue = (!(key in obj) && !isNaN(next)) ? [] : {};
        obj = obj[key] = obj[key] || defaultValue;
    }
    obj[props[n]] = val;
    controller.debug(`${JSON.stringify(obj)}`, { source });
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
function reducer(state: AppStore, action: SetAction): AppStore {
    controller.info(`recieved action: ${JSON.stringify(action)}`, { source: "reducer" });
    if (action.type !== "set") {
        throw new Error(`ActionType "${action.type}" not recognized`);
    }

    const newState = new AppStore({ ...state });
    if (!(action.payload.value instanceof Array)) {
        const n = Number(action.payload.value);

        if (!isNaN(n) && action.payload.value !== "") {
            action.payload.value = n;
        }
    }
    newState.set(idToPath(action.payload.key), action.payload.value);
    newState.updateBlocks();
    return newState;
}

export const initState = new AppStore({
    blocks: [{
        excercises: ["", ""],
        intro: "",
    }],
    level: "",
    library: [""],
    numBlocks: 1,
    // @todo investigate.
    // library: getBins(),
});

export const StoreContext = createContext<[AppStore, React.Dispatch<SetAction>]>([
    initState,
    () => { throw new Error("no reducer has been set"); },
]);

export function StoreProvider({ children }: { children: any; }): JSX.Element {
    const [state, dispatch] = useReducer(reducer, initState);
    return (<StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>);
}

export async function Update(state: AppStore, dispatch: React.Dispatch<SetAction>) {
    const source = "Update";

    async function updateBins(): Promise<boolean> {
        try {
            const functionName = "getBins";
            // controller.info("Waiting for bins...", { source });
            let bins = await window.session.run(functionName);
            // controller.info("Bins received.", { source });
            bins = ["", ...bins];
            if (bins !== state.library) {
                dispatch({ type: "set", source, payload: { key: "library", value: bins } });
                return true;
            }
        } catch (error) {
            controller.error(`Couldn't call run: ${error}`, { source });
        }
        return false;
    }

    async function updateAvail(): Promise<boolean> {
        try {
            const binName = (state.level === "") ? undefined : state.level;
            const projectItems: Array<{ name: string, type: number }> = await window.session.run("listProjectItemsJSON", binName);
            const videos: string[] = [""];
            for (const item of projectItems) {
                if (item.type === ProjectItemType.Clip) {
                    videos.push(item.name);
                }
            }
            videos.push(importOption);
            if (state.availableVideos !== videos) {
                dispatch({ type: "set", source, payload: { key: "availableVideos", value: videos } });
                return true;
            }
            // const i = newState.availableVideos.indexOf(clipName);
            // const max = (a: number, b: number) => (a > b) ? a : b;
            // newState.set(idToPath(action.payload.key), newState.availableVideos[max(i, 0)]);
        } catch (error) {
            controller.error(`Couldn't call run: ${error}`, { source });
        }
        return false;
    }

    async function importVideo(): Promise<string> {
        const binName = (state.level === "") ? undefined : state.level;
        return window.session.run("importVideo", binName);
    }

    try {
        if (controller.hasSession()) {
            await updateBins();
            let clipName;
            if (state.intro === importOption) {
                clipName = await importVideo();
            }
            await updateAvail();
            if (typeof clipName === "string") {
                dispatch({ type: "set", source, payload: { key: "intro", value: clipName } });
            }
        } else {
            window.alert("Window does not have session.");
        }
    } catch (error) {
        controller.error(`Couldn't call run: ${error}`, { source });
    }

}
