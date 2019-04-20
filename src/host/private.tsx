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
