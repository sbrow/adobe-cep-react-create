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


function test_host(jsonString: JSONString) {
    let res = JSON.parse(jsonString);
    return `hola from extendscript "${res.name}"`;
}

function getBins() {
    const items = JSON.parse(listProjectItems() || "[]");
    var bins = [];

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.type === 2) {
            bins.push(item.name);
        }
    }
    return JSON.stringify(bins);
}


function listProjectItems(): string | null {
    try {
        var ret: { name: string, type: number }[] = [];

        const children = app.project.rootItem.children;
        if (children === undefined) {
            return "[]";
        }
        for (var i = 0; i < children.numItems; i++) {
            var child = children[i];
            ret.push({
                name: child.name,
                type: child.type
            })
        }
        return JSON.stringify(ret);
    } catch (err) {
        alert("list returned " + err)
    }
    return null
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

        var inTime: number | null = 0;
        if (lib !== undefined && clips instanceof Array) {
            for (const clip of clips) {
                for (var j = 0; j < lib.numItems; j++) {
                    let child = lib[j];
                    if (child.name === clip) {
                        if (inTime !== null) {
                            inTime = insert(child, inTime);
                            inserted++;
                            break;
                        }
                    }
                }
            }
        }
    } catch (err) {
        alert("error in insertClips: " + err)
    }
    return inserted;
}

function insert(clip: Clip, inTime: number): number | null {
    if (clip.type !== ProjectItemType.CLIP) {
        alert("Attempted to insert a ProjectItem that is not a clip.")
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

    let time = inTime + clip.getOutPoint().seconds;
    return Number(time);
}