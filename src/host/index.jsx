// @include "./test.jsx"

// if (typeof ($) === "undefined") {
//     $ = {};
// }

$._ext = {
    // Evaluate a file and catch the exception.
    evalFile(path) {
        try {
            $.evalFile(path);
        } catch (e) {
            alert("Exception:" + e);
        }
    },
    // Evaluate all the files in the given folder
    evalFiles(jsxFolderPath) {
        const folder = new Folder(jsxFolderPath);
        if (folder.exists) {
            const jsxFiles = folder.getFiles("*.jsx");
            for (let i = 0; i < jsxFiles.length; i++) {
                const jsxFile = jsxFiles[i];
                $._ext.evalFile(jsxFile);
            }
        }
    },
    testAlert,
};