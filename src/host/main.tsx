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

// TODO: move to `test.jsx`.
function test_host(jsonString: JSONString) {
    const res = JSON.parse(jsonString);
    return `hola from extendscript "${res.name}"`;
}

function getProjectItem(name: string, entrypoint?: ProjectItem): ProjectItem | null {
    try {
        const entry = entrypoint || app.project.rootItem;
        const children = entry.children;
        if (children === undefined) {
            return null;
        }
        for (let i = 0; i < children.numItems; i++) {
            const child = children[i];
            if (child.name === name) {
                return child;
            }
        }
    } catch (error) {
        alert(`list returned ${error}`);
    }
    return null;
}
/**
 * Imports a video into bin `binName` and returns the name of the imported file.
 *
 * @param {string} binName The name of the bin to import into
 * @returns {string} The name of the imported file.
 */
function importVideo(binName: string): boolean {
    const project = app.project;
    const prevBin = project.getInsertionBin();
    const bin = getProjectItem(binName);
    if (bin !== null) {
        bin.select();
    }

    let file = File.openDialog("Select file").toString();
    // TODO: Fix this.
    file = file.replace(/^~/, "/Users/sbrow");

    const success = project.importFiles([file], false);
    if (prevBin !== null) {
        prevBin.select();
    }

    /*     if (success) {
            const newItem = getProjectItem("");
        } */
    return success;
}

/**
 * @returns {string} a JSONString Array of all top level bins.
 */
function getBins() {
    const items = listProjectItems() || [];
    const bins = [];

    for (const item of items) {
        if (item.type === 2) {
            bins.push(item.name);
        }
    }
    return JSON.stringify(bins);
}

function listProjectItems(): Array<{ name: string, type: number }> | null {
    try {
        const ret: Array<{ name: string, type: number }> = [];

        const children = app.project.rootItem.children;
        if (children === undefined) {
            return [];
        }
        for (let i = 0; i < children.numItems; i++) {
            const child = children[i];
            ret.push({
                name: child.name,
                type: child.type,
            });
        }
        return ret;
    } catch (err) {
        alert("list returned " + err);
    }
    return null;
}

/**
 *
 * @returns the number of clips inserted.
 */
function insertClips(clips: string | string[]): number {
    const project = app.project;
    const lib = project.rootItem.children;
    let inserted = 0;
    try {
        if (typeof clips === "string") {
            clips = JSON.parse(clips);
        }

        let inTime: number | null = 0;
        if (lib !== undefined && clips instanceof Array) {
            for (const clipName of clips) {
                for (let j = 0; j < lib.numItems; j++) {
                    const child = lib[j];
                    if (child.name === clipName && child.type === ProjectItemType.CLIP) {
                        if (inTime !== null) {
                            const clip = child as Clip;
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
