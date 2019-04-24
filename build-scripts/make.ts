import "json";
import * as path from "path";
import * as shelljs from "shelljs";
import { destinationFolder, extensionBundleId } from "../pluginrc";

const root = "./";
const srcDir = path.join(root, "src");

console.log("Syncing tslint.json files...");
const dirs = ["./src/client", "./src/host", "./src/session"];
for (const dir of dirs) {
    shelljs.cp("./tslint.json", dir);
}
console.log("Copying type definitions from host to client.");
shelljs.cp("./src/host/types/host.d.ts", "./src/client/types");
const key = "compilerOptions.outDir";
const value = path.join(destinationFolder, extensionBundleId, "host");
const file = path.join(srcDir, "host", "tsconfig.json");
console.log(`Setting "${key}" in ${file}`);
shelljs.exec(`json -I -f ${file} -e 'this.${key}="${value}"'`);
