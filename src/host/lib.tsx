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
        alert(JSON.stringify({ currentBin: project.getInsertionBin().name, bin: (bin !== null), binName }));

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
                alert(JSON.stringify({ name: newItemName }));
                const newItem = getProjectItem(newItemName, searchBin);
                alert(JSON.stringify(newItem));
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
            clipNames = JSON.parse(clipNames);
        }

        let inTime: number | null = 0;
        if (lib !== undefined && clipNames instanceof Array) {
            for (const clipName of clipNames) {
                for (let j = 0; j < lib.numItems; j++) {
                    const child = lib[j];
                    if (child.name === clipName && child.type === ProjectItemType.CLIP) {
                        if (inTime !== null) {
                            const clip = (child as Clip);
                            inTime = insert(clip, inTime);
                            inserted++;
                            break;
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

/**
 * Inserts a clip into the active sequence at the specified time.
 *
 * @param {Clip} clip
 * @param {number} inTime
 * @returns {(number | null)} The end time of the clip in sequence.
 */
function insert(clip: Clip, inTime: number): number | null {
    if (clip.type !== ProjectItemType.CLIP) {
        alert("Attempted to insert a ProjectItem that is not a clip.");
        return null;
    }

    const project = app.project;
    if (project.activeSequence === undefined) {
        alert("There is no active sequence.");
        return null;
    }
    const sequence = project.activeSequence;
    const video = sequence.videoTracks[0];

    video.insertClip(clip, inTime);

    const time = inTime + clip.getOutPoint().seconds;
    return Number(time);
}
