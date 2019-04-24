/**
 * This file contains functions that are not safe to call from the outside- due to not returning strings.
 */

const projectItemTypes: number[] = [
    ProjectItemType.CLIP,
    ProjectItemType.BIN,
    ProjectItemType.ROOT,
    ProjectItemType.FILE,
];

const defaultFilter: ItemFilter = {
    depth: -1,
    types: projectItemTypes,
};

enum VideoFormat {
    TIMEDISPLAY_2997DropTimecode = 102,
    TIMEDISPLAY_23976Timecode = 110,
}

const Framerates: {[key: number]: number} = {
    102: 29.97,
    110: 23.976,
};

const TicksPerSecond = 254016000000;

function ticksToSeconds(time: Ticks, timeBase: Ticks, framesPerSecond: number): Seconds  {
    const secs: Seconds = Math.floor(time / TicksPerSecond);
    const remainder: Ticks = time % TicksPerSecond;
    const frames: number = Math.floor(remainder / timeBase);
    const frameLength: Seconds = Number((1 / framesPerSecond).toFixed(2));
    return secs + frames * frameLength;
}

function getProjectItem(
    name: string,
    entrypoint: ProjectItem = app.project.rootItem,
    types: number[] = projectItemTypes): ProjectItem {
    return getProjectItems(entrypoint, { name, types })[0];
}

/**
 * @param {ProjectItem} [entrypoint] The bin to begin the search from.
 * @returns {ProjectItem[]} All bins that are children of entry,
 * or `project.rootItem` if entry is undefined.
 */
function getBins(entry: ProjectItem = app.project.rootItem): ProjectItem[] {
    return getProjectItems(entry, { types: [ProjectItemType.BIN] });
}

/**
 * @param {(ProjectItem | string)} [entry]
 * @param {ItemFilter} [filter=defaultFilter] Optional key object to filter search. `name` is filtered before `types`.
 * @returns {ProjectItem[]} All `ProjectItems` that are immediate children of entry,
 * and have a type that matches an index of `types`.
 */
function getProjectItems(
    entry: ProjectItem | string = app.project.rootItem,
    filter: ItemFilter = defaultFilter): ProjectItem[] {
    const ret: ProjectItem[] = [];
    try {
        const entrypoint: ProjectItem = (typeof entry === "string") ? getProjectItem(entry) : entry;

        if (filter.types === undefined) {
            filter.types = projectItemTypes;
        }
        const children = entrypoint.children;
        if (children !== undefined) {
            for (let i = 0; i < children.numItems; i++) {
                const child = children[i];
                if (matches(child, filter)) {
                    ret.push(child);
                }
            }
        }
    } catch (error) {
        alert("list returned " + error);
    }
    return ret;
}

function matches(obj: any, filter: ItemFilter): boolean {
    if (filter.name !== undefined && !(obj.name.match(filter.name))) {
        return false;
    }
    if (filter.types !== undefined && filter.types.indexOf(obj.type) === -1) {
        return false;
    }
    if (filter.path !== undefined && filter.path !== obj.path) {
        return false;
    }
    return true;
}

/**
 *
 *
 * @param {string} path The path to the ProjectItem
 * @returns {ProjectItem} The item at the path.
 */
function getProjectItemFromPath(path: string): ProjectItem {
    let previousPart: ProjectItem = app.project.rootItem;
    let part: ProjectItem = previousPart;
    try {
        const parts = path.split("\\").slice(2);
        for (const currentPart of parts) {
            part = getProjectItem(currentPart, previousPart);
            previousPart = part;
        }
    } catch (error) {
        alert(error);
    }
    return part;
}

function createNewSequence(): boolean {
    const makeNew = confirm("There is no active sequence, would you like to create a new one?", false);
    if (makeNew) {
        const newSequence: Sequence | undefined = app.project.createNewSequence("New Sequence", "");
        return (newSequence !== undefined);
    } else {
        alert("Please open a sequence in the timeline and try again.");
        return false;
    }
}

/**
 * Inserts a clip into the active sequence at the specified time.
 *
 * @param {Clip} clip
 * @param {Ticks} inTime
 * @returns {(Ticks | null)} The end time of the clip in sequence.
 */
function insert(clip: Clip, inTime: Ticks = 0): Ticks | undefined {
    if (clip.type !== ProjectItemType.CLIP) {
        alert("Attempted to insert a ProjectItem that is not a clip.");
        return undefined;
    }
    if (app.project.activeSequence === undefined) {
        const success = createNewSequence();
        if (!success) {
            return undefined;
        }
    }

    const sequence = app.project.activeSequence;
    const video = sequence.videoTracks[0];
    if (inTime === -400000) {
        inTime = 0;
    }

    try {
        const format: VideoFormat = sequence.getSettings().videoDisplayFormat;
        const fps = Framerates[format];
        const {end, timebase} = sequence;
        const inPointSeconds: Seconds = ticksToSeconds(Number(end), Number(timebase), fps);
        video.insertClip(clip, inPointSeconds);
    } catch (error) {
        alert(error);
    }
    const time = Number(sequence.end);
    return time;
}
