// Doesn't work.
function newSequence() {
    const project = app.project;
    // project.openSequence(new Sequence("12"));

    project.createNewSequence("name", "12");
}

function itemChildren() {
    const item = projectItem(0);
    if (item !== null) {
        alert(JSON.stringify(item.videoComponents));
    }
}

function activeSequence() {
    const project = app.project;
    alert(JSON.stringify(project.activeSequence));
}

function testAlert() {
    alert("Testing...");
}

function projectItem(index: number): ProjectItem | null {
    if (index === undefined) {
        index = 0;
    }
    const project = app.project;
    const rootItem = project.rootItem;

    if (rootItem.children !== undefined) {
        return rootItem.children[index];
    }
    return null;
}

function getOutPoint() {
    const project = app.project;
    const seq = project.activeSequence;
    return seq.getOutPoint();
}

/**
 * Removes the audio from a video and saves it as a separate item.
 */
function stripAudio() {
    const item = projectItem(0);
    if (item !== null) {
        alert(`${item.type}`);
        if (item.type === ProjectItemType.CLIP) {
            const clip = item as Clip;
            clip.createSubClip("clip", clip.startTime(), clip.getOutPoint(), 0, 0, 1);
        }
    }
}

function getTimebase() {
    const project = app.project;
    const seq = project.activeSequence;
    return JSON.stringify(seq.timebase);
}

function test_host(jsonString: JSONString) {
    const res = JSON.parse(jsonString);
    return `hola from extendscript "${res.name}"`;
}
