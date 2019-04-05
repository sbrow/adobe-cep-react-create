function newSequence() {
    const project = app.project;
    // Didn't work
    // project.openSequence(new Sequence("12"));

    project.createNewSequence("name", "12");
}
function itemChildren() {
    const item = projectItem(0);
    alert(JSON.stringify(item.videoComponents));
}
function activeSequence() {
    const project = app.project;

    alert(JSON.stringify(project.activeSequence));
}

function testAlert() {
    alert("Testing...");
}

function projectItem(index) {
    if (index === undefined) {
        index = 0;
    }
    const project = app.project;

    const item = project.rootItem.children[index];
    return item;
}

function getOutPoint() {
    const item = projectItem(0);
    alert(item.getOutPoint());
}

/**
 * Removes the audio from a video and saves it as a separate item.
 */
function stripAudio() {
    const item = projectItem(0);
    alert(item.type);
    item.createSubClip("clip", item.startTime(), item.getOutPoint(), 0, 0, 1);
}

function insertClip() {
    const project = app.project;
    const sequence = project.activeSequence;
    const video = sequence.videoTracks[0];
    const clip = projectItem(0);
    const inTime = 0;
    const length = inTime + clip.getOutPoint().seconds;

    video.insertClip(clip, 0);
    alert(length);
    return length;
}
