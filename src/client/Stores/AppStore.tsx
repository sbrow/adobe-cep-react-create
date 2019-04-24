import * as React from "react";
import { createContext } from "react";
import controller from "../controller";
import { BlockStore, IFormState, ProjectItemType, SetAction } from "../types";

export const importOption = "Import new...";

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

const initState: IFormState = {
    bins: [],
    blocks: [{
        exercises: [],
        intro: "",
        rounds: 1,
    }],
    level: "",
    numBlocks: 1,
};

export class AppStore {
    public availableVideos: SimpleProjectItem[];
    public level: string;
    public numBlocks: number;
    public bins: string[];
    public intro: string;
    public warmup: string;
    public blocks: BlockStore[];
    public outro: string;

    constructor(init: IFormState = initState) {
        this.bins = init.bins || [];
        this.blocks = init.blocks || [{ exercises: [], intro: "", rounds: 1 }];
        this.level = init.level || "";
        this.numBlocks = init.numBlocks || 1;
        this.intro = init.intro;
        this.warmup = init.warmup;
        this.outro = init.outro;
        this.availableVideos = init.availableVideos || [];
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
    public set(path: string, value: any): void {
        const setDeepValue = (obj: any, path: string, val: any): any => {
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
        };
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
                this.blocks.push({ rounds: 1, intro: "", exercises: [] });
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
                            for (const video of this.availableVideos) {
                                if (video.name === item) {
                                    imports.push(video.path);
                                    break;
                                }
                            }
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
                    for (let i = 0; i < block.rounds; i++) {
                        push(...block.exercises.filter((elem) => elem !== ""));
                    }
                }
            });
            push(this.outro);
        } catch (e) {
            controller.error(JSON.stringify(e), { source: "state.videos" });
        }
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

export const StoreContext = createContext<[AppStore, React.Dispatch<SetAction>]>([
    new AppStore(),
    () => { throw new Error("no reducer has been set"); },
]);

export async function Update(state: AppStore, dispatch: React.Dispatch<SetAction>) {
    const source = Update.name;

    async function updateBins(): Promise<boolean> {
        try {
            const functionName = "getBinsJSON";
            controller.debug("Waiting for bins...", { source });
            const bins = await window.session.run(functionName);
            controller.debug("Bins received.", { source });
            const t = (JSON.stringify(state.bins) !== JSON.stringify(bins));
            controller.debug(JSON.stringify({ stateBins: state.bins, bins, neq: t }), { source });
            if (t) {
                dispatch({ type: "set", source, payload: { key: "bins", value: bins } });
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
            const projectItems: SimpleProjectItem[] = await window.session.run("listProjectItemsJSON", binName);
            const videos: SimpleProjectItem[] = [];
            for (const item of projectItems) {
                if (item.type === ProjectItemType.CLIP) {
                    videos.push(item);
                }
            }
            const t = JSON.stringify(videos) !== JSON.stringify(state.availableVideos);
            controller.debug(JSON.stringify({ videos, avail: state.availableVideos, neq: t }), { source });
            if (t) {
                dispatch({ type: "set", source, payload: { key: "availableVideos", value: videos } });
                return true;
            }
        } catch (error) {
            controller.error(`Couldn't call run: ${error}`, { source });
        }
        return false;
    }

    try {
        if (controller.hasSession()) {
            controller.debug("Updating", { source });
            await updateBins();
            await updateAvail();
        } else {
            window.alert("Window does not have session.");
        }
    } catch (error) {
        controller.error(`Couldn't call run: ${error}`, { source });
    }

}

/**
 * Handles actions for storeState
 *
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export function reducer(state: AppStore, action: SetAction): AppStore {
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
