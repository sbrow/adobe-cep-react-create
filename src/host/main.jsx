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

// tslint:disable-next-line: semicolon
#include "./JSON.jsx";

// alert(JSON.stringify(a))

function test_host(obj_string) {
	// alert(obj_string)
	res = JSON.parse(obj_string);
	// alert(res)
	return "hola from extendscript " + res.name;
}

function listProjectItems(obj) {
	var ret = [];

	const children = app.project.rootItem.children;
	for (var i = 0; i < children.numItems; i++) {
		var child = children[i];
		ret.push(child.name + ":" + child.type)
	}
	return ret;
}

function insertClips(clips) {
	const project = app.project;
	const lib = project.rootItem.children;
	const inserted = 0;
	try {
		if (typeof clips === "string") {
			clips = JSON.parse(clips);
		}

		alert(JSON.stringify(
			{
				clips: clips,
				type: (typeof clips),
				arr: (clips instanceof Array),
				length: clips.length
			}))
		var inTime = 0;
		for (var i = 0; i < clips.length; i++) {
			var clip = clips[i];
			for (var j = 0; j < lib.numItems; j++) {
				var child = lib[i];
				if (child.name === clip) {
					inTime = insertClip(child, inTime);
					inserted++;
					break;
				}
			}
		}
	} catch (err) {
		alert("error in insertClips: " + err)
	}
	return inserted;
}

function insert(clip, inTime) {
	const project = app.project;
	if (project.activeSequence === undefined) {
		alert("There is no active sequence.");
		return;
	}
	const sequence = project.activeSequence;
	const video = sequence.videoTracks[0];
	const outTime = inTime + Number(clip.getOutPoint().seconds);

	video.insertClip(clip, inTime);
	return outTime;
}
