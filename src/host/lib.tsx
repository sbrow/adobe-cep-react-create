/*
Copyright 2018 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
// @include "./JSON.jsx"
// @include "./private.jsx"

/**
 * Imports a video into bin `binName` and returns the name of the imported file.
 *
 * @param {string} binName The name of the bin to import into
 * @returns {string} The name of the imported file.
 */
function importVideo(binName?: string): string {
    try {
        const project = app.project;
        project.rootItem.select();
        const prevBin = project.getInsertionBin();
        const bin = (binName === undefined) ? null : getProjectItem(binName);
        if (bin !== null) {
            bin.select();
        }
        // alert(JSON.stringify({ currentBin: project.getInsertionBin().name, bin: (bin !== null), binName }));

        const file = File.openDialog("Select file");
        if (file !== null) {
            const filename = file.fsName;
            const success = project.importFiles([filename], false);
            if (prevBin !== null) {
                // prevBin.select();
            }
            if (success) {
                const searchBin = (bin === null) ? undefined : bin;
                const newItemName = file.name;
                // alert(JSON.stringify({ name: newItemName }));
                const newItem = getProjectItem(newItemName, searchBin);
                // alert(JSON.stringify(newItem));
                if (newItem !== null) {
                    return JSON.stringify(newItem.name);
                }
            }
        }
    } catch (error) {
        alert(error);
    }
    return "";
}

/**
 * @returns {string} a JSONString Array of all top level bins.
 */
function getBinsJSON(): string {
    return JSON.stringify(getProjectItems(undefined, { types: [ProjectItemType.BIN] }));
}

function listProjectItemsJSON(entrypoint?: ProjectItem | string): JSONString {
    const ret: SimpleProjectItem[] = [];
    const projectItems = getProjectItems(entrypoint);
    for (const item of projectItems) {
        ret.push({
            name: item.name,
            type: item.type,
            path: item.treePath,
        });
    }
    return JSON.stringify(ret);
}

/**
 * @returns the number of clips inserted.
 */
function insertClips(clipNames: string | string[]): number {
    const project = app.project;
    const lib = project.rootItem.children;
    let inserted = 0;
    try {
        if (typeof clipNames === "string") {
            clipNames = JSON.parse(clipNames.replace(/\\/g, "\\\\"));
        }

        if (lib !== undefined && clipNames instanceof Array) {
            let inTime: number | undefined = Number(project.activeSequence.end);
            for (const clipName of clipNames) {
                const clip = getProjectItemFromPath(clipName);
                const name = clipName.match(/[^\\]*$/g);
                if (name !== null && name[0] === clip.name) {
                    if (clip.type === ProjectItemType.CLIP) {
                        if (inTime !== undefined) {
                            inTime = insert((clip as Clip), (inTime as Ticks));
                            inserted++;
                        }
                    }
                }
            }
        }
    } catch (err) {
        alert("error in insertClips: " + err);
    }
    return inserted;
}
