import "extendscript-xml-to-typescript";
import * as path from "path";
import * as shelljs from "shelljs";

const dir = "/Library/Application Support/Adobe/Scripting Dictionaries CC/CommonFiles".replace(/ /g, "\\ ");
const dir2 = path.join(process.env.HOME, "/Library/Preferences/ExtendScript Toolkit/4.0").replace(/ /g, "\\ ");
const XMLFiles = path.join(dir, "*.xml");
const XMLFiles2 = path.join(dir2, "*.xml");
const DTSFiles = path.join(dir, "*.d.ts");
const DTSFiles2 = path.join(dir2, "*.d.ts");
const root = path.dirname(__dirname);
const localDir = path.join(root, "src", "dumped_types");

try {
    console.log("dump requires admin privileges, you may need to enter your password.");
    shelljs.exec(`sudo extendscript-xml-to-typescript ${XMLFiles} ${XMLFiles2}`);
    const files = [...shelljs.ls(`${DTSFiles}`), ...shelljs.ls(`${DTSFiles2}`)];
    for (const filename of files) {
        console.log(`Copying ${path.basename(filename)}`);
        shelljs.cp(filename.replace(/\$/g, "\\$"), localDir);
    }
} catch (error) {
    console.error("Try re-running with sudo.");
}
