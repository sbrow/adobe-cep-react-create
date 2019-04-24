import { execSync } from "child_process";
import { sync as glob } from "glob";
import * as path from "path";
import * as shelljs from "shelljs";

const dir = "/Library/Application Support/Adobe/Scripting Dictionaries CC/CommonFiles";
const dir2 = path.join(process.env.HOME, "/Library/Preferences/ExtendScript Toolkit/4.0");
const XMLFiles = path.join(dir, "*.xml");
const XMLFiles2 = path.join(dir2, "*.xml");
const DTSFiles = path.join(dir, "*.d.ts");
const DTSFiles2 = path.join(dir2, "*.d.ts");
const root = path.dirname(__dirname);
const localDir = path.join(root, "src", "dumped_types");

try {
    console.log("dump requires admin privileges, you may need to enter your password.");
    const args = `"${glob(XMLFiles).join('" "')}" "${glob(XMLFiles2).join('" "').replace(/\$/g, "\\$")}"`;
    shelljs.exec(`sudo extendscript-xml-to-typescript ${args}`);
    for (const filename of (glob(DTSFiles).concat(glob(DTSFiles2)))) {
        shelljs.cp(filename.replace(/\$/g, "\\$"), localDir);
    }
} catch (error) {
    console.error("Try re-running with sudo.");
}
