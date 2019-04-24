/**
 * This file contains functions that are not safe to call from the outside- due to not returning strings.
 */
// @include "videoFormat.jsx"

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

const videoFormats = {
    102: new VideoFormat("TIMEDISPLAY_2997DropTimecode", 29.97),
};

const TicksPerSecond = 254016000000;

function secondsPerFrame(timebase: JSONString): JSONString {
    return JSON.stringify(Number(timebase) / TicksPerSecond);
}

function ticksToSecond(ticks: JSONString, timebase: JSONString, fps: number): JSONString {
    const frames = Number(ticks) / Number(timebase);
    const ret = (frames / fps);
    return JSON.stringify(ret);
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
